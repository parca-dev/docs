# Storage

Parca has two distinct storage components: meta store and sample store. The meta store stores metadata such as function names, line numbers, file names, and so on. The sample store stores the profiling data.

## Meta Store

Under the hood, Parca uses the embedded key-value store [badger](https://dgraph.io/docs/badger/) for the meta store. Entities are marshaled using [protobuf](https://developers.google.com/protocol-buffers) they are identified by UUIDs.

Requests to store profiles are either coming from Parca's scraper, which collects profiles by scraping a target's HTTP endpoint or coming from a process that is writing into Parca directly, like the [Parca agent](https://github.com/parca-dev/parca/issues/parca-agent).

Upon receiving a request, Parca unmarshalls the request into the upstream [pprof protobuf](https://github.com/parca-dev/parca/blob/main/proto/google/pprof/profile.proto) definition. This ensures that the profiles are valid pprof profiles but also that Parca is compatible with pprof.

There are three main entities in the meta store: mappings, functions, and locations.

### Mappings

A mapping represents a single object file that a part of a stack trace originated from. The name comes from the way binaries are mapped by Linux to execute a process (on Linux check out `/proc/<PID>/maps`).

Mappings are stored at `mappings/by-id/<UUID>` with a lookup index at `v1/mappings/by-key/<uint64-size><uint64-offset><build-id-or-file>`, which allows mappings to be deduplicated if a mapping has been seen previously.

### Functions

A function contains normalized data that uniquely identifies a function: function name, starting line number, file name, and system name (describes the name of the function, as identified by the system, for instance, it can be a C++ mangled name).

Functions are stored at `functions/by-id/<UUID>` with a lookup index at `v1/functions/by-key/<uint64-start-line><name><systemname><filename>`, which allows functions to be deduplicated if a function has been seen previously.

### Locations

A location is typically a single step in a stack trace, it references the combination of mapping and function with the concrete line number, that the location represents. If the location came from a compiled binary, then it also includes the memory address that was observed. If a compiler inlined a function, then a location may reference multiple functions.

Locations are stored at `locations/by-id/<UUID>` with a lookup index depending on whether the location came from an interpreted frame or from a compiled execution:

* Compiled frame: `<mapping-UUID><memory-address><is-folded>`
* Interpreted frame: Repeated per function: `<function-UUID><line-number>`

## Sample Store

When a client writes profiling data to Parca, the data is normalized and metadata is looked up in the meta store to deduplicate. After normalizing, the required metadata has been stored in the meta store and what's left are samples that reference location UUIDs, making up the stack traces. This is the sample data that is stored in the sample store.

Parca uses [FrostDB](https://github.com/polarsignals/frostdb) to store samples. FrostDB is a columnar database specifically developed for Observability purposes (originally created specifically for Parca).

Profiling data at a high level can be described as stacktraces with a value attached, so continuous profiling is the same, except it adds the time dimension. Take some example data:

| Stacktrace       | t1 | t2   | t3   | ... |
| ---------------- | -- | ---- | ---- | --- |
| main;func1;func2 | 2  | 3    | null | ... |
| main;func1;func3 | 23 | null | 234  | ... |

To make querying multi-dimensional data familiar, the data model of Parca, is highly inspired by [Prometheus' data model](https://prometheus.io/docs/concepts/data_model/). For example to select all profiling data of a specific node a label-selector is used to query it:

```
cpu{node="123.my-node-pool.polarsignals.com"}
```

Labels can be anything. Infrastructure labels such as `region`, `datacenter`, `node`, etc. or application specific labels such as `version` are popular labels used.

Logically the data is laid out in a table as in this example:

| labels.pod | labels.node | timestamp | stacktrace       | value |
| ---------- | ----------- | --------- | ---------------- | ----- |
| mypod1     | mynode1     | t1        | main;func1;func2 | 2     |
| mypod1     | mynode1     | t1        | main;func1;func4 | 3     |
| mypod1     | mynode1     | t1        | main;func1;func3 | 23    |
| mypod1     | mynode1     | t2        | main;func1;func2 | 10    |
| mypod1     | mynode1     | t2        | main;func1;func3 | 12    |
| mypod1     | mynode1     | t3        | main;func1;func3 | 234   |

In a columnar database data is stored by columns instead of by rows, allowing the repetitiveness of the data to be exploited. Using that strategy, while logically the data is the above table, physically it can be represented much more efficiently:

| labels.pod | labels.node | timestamp | stacktrace       | value |
| ---------- | ----------- | --------- | ---------------- | ----- |
| 6 x mypod1 | 6 x mynode1 | 3 x t1    | main;func1;func2 | 2     |
|            |             |           | main;func1;func3 | 23    |
|            |             |           | main;func1;func4 | 3     |
|            |             | 2 x t2    | main;func1;func2 | 10    |
|            |             |           | main;func1;func3 | 12    |
|            |             | t3        | main;func1;func3 | 234   |

Sorting by the dynamic columns and immediately followed by the timestamp column has been shown in benchmarks to be an effective way of ignoring data that is outside of the requested time range. In our example above, we might only be interested in the `cpu{pod="mypod1",node="mynode1"}` from `t2` to `t3`. Upon iterating over the data, FrostDB ignores all the data below `t2`.

Read more on how arcticDB and Parca were originally created in the announcement blog post: https://www.polarsignals.com/blog/posts/2022/05/04/introducing-arcticdb/
