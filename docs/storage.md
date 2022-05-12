# Storage

Parca has two distinct storage components: metastore and samplestore. The metastore stores metadata such as function names, line numbers, file names, and so on. The samplestore stores the profiling data.

## Metastore

Under the hood, Parca uses the embedded key-value store [badger](https://dgraph.io/docs/badger/) for the metastore. Entities are marshaled using [protobuf](https://developers.google.com/protocol-buffers) they are identified by UUIDs.

Requests to store profiles are either coming from Parca's scraper, which collects profiles by scraping a targets' HTTP endpoint or coming from a process that is writing into Parca directly, like the [Parca agent](parca-agent).

Upon receiving such a request, Parca uses [pprof's upstream parser](https://pkg.go.dev/github.com/google/pprof/profile#Parse) to parse and validate these profiles. This ensures that the profiles are valid pprof profiles but also that Parca is compatible with pprof.

There are four main entities in the metastore: mappings, functions, locations.

### Mappings

A mapping represents a single object file that a part of a stacktrace originated from. The name comes from the way binaries are mapped by Linux to execute a process (on Linux check out `/proc/<PID>/maps`).

Mappings are stored at `mappings/by-id/<UUID>` with a lookup index at `v1/mappings/by-key/<uint64-size><uint64-offset><build-id-or-file>`, which allows mappings to be deduplicated if a mapping has been seen previously.

### Functions

A function contains normalized data that uniquely identifies a function: function name, starting line number, file name, system name (describes the name of the function, as identified by the system, for instance, it can be a C++ mangled name).

Functions are stored at `functions/by-id/<UUID>` with a lookup index at `v1/functions/by-key/<uint64-start-line><name><systemname><filename>`, which allows functions to be deduplicated if a function has been seen previously.

### Locations

A location is typically a single step in a stacktrace, it references the combination of mapping and function with the concrete line number, that the location represents. If the location came from a compiled binary, then it also includes the memory address that was observed. If a compiler inlined a function, then a location may reference multiple functions.

Locations are stored at `locations/by-id/<UUID>` with a lookup index depending on whether the location came from an interpreted frame or from a compiled execution:

* Compiled frame: `<mapping-UUID><memory-address><is-folded>`
* Interpreted frame: Repeated per function: `<function-UUID><line-number>`

## Sample store

When a client writes profiling data to Parca, the data is normalized and metadata is looked up in the metastore to deduplicate. After normalizing, the required metadata has been stored in the metastore and what's left is samples that reference location UUIDs, making up the stack traces. This is the sample data that is stored in the sample store.

Parca uses [arcticDB](https://github.com/polarsignals/arcticdb) to store samples. ArcticDB is a columnar database specifically developed for Observability purposes (and was originally created specifically for Parca).

Profiling data at a high level can be described as stacktraces with a value attached, so continuous profiling is the same, except it adds the time dimension. Take some example data:

| Stacktrace       | t1 | t2   | t3   | ... |
| ---------------- | -- | ---- | ---- | --- |
| main;func1;func2 | 2  | 3    | null | ... |
| main;func1;func3 | 23 | null | 234  | ... |

To make querying multi-dimensional data familiar, the data model of Parca, is highly inspired by [Prometheus' data model](https://prometheus.io/docs/concepts/data_model/). For example to select all profiling data of a specific node a label-selector is used to query it:

```
cpu{node=”123.my-node-pool.polarsignals.com”}
```

Labels can be anything. Infrastructure labels such as `region`, `datacenter`, `node`, etc. or application specific labels such as `version` are popular labels used.

Logically the data is laid out in a table as in this example:

| labels.pod | labels.node | stacktrace       | timestamp | value |
| ---------- | ----------- | ---------------- | --------- | ----- |
| mypod1     | mynode1     | main;func1;func2 | t1        | 2     |
| mypod1     | mynode1     | main;func1;func2 | t4        | 3     |
| mypod1     | mynode1     | main;func1;func3 | t1        | 23    |
| mypod1     | mynode1     | main;func1;func3 | t2        | 10    |
| mypod1     | mynode1     | main;func1;func3 | t3        | 12    |
| mypod1     | mynode1     | main;func1;func3 | t5        | 234   |

In a columnar database data is stored by columns instead of by rows, allowing the repetitiveness of the data to be exploited. Using that strategy, while logically the data is the above table, physically it can be represented much more efficiently:

| labels.pod | labels.node | stacktrace           | timestamp | value |
| ---------- | ----------- | -------------------- | --------- | ----- |
| 6 x mypod1 | 6 x mynode1 | 2 x main;func1;func2 | t1        | 2     |
|            |             | 4 x main;func1;func3 | t4        | 3     |
|            |             |                      | t1        | 23    |
|            |             |                      | t2        | 10    |
|            |             |                      | t3        | 12    |
|            |             |                      | t5        | 234   |

Read more on how arcticDB and Parca were originally created in the announcement blog post: https://www.polarsignals.com/blog/posts/2022/05/04/introducing-arcticdb/
