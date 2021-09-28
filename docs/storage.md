# Storage

Parca's Time Series Database (TSDB) was heavily influenced by Prometheus' TSDB. While it has a lot of similarities with a time-series database, Parca makes use of many characteristics of profiling data to optimize the storage for the profiling data, so it's not a general-purpose TSDB.

Still, in a lot of places, Parca simply uses Prometheus packages to not re-invent the wheel and to be consistent with the way Prometheus works.

As for the storage itself, Parca follows Prometheus' storage in a lot of ways too. It has an in-memory head that all new samples are appended to. And the concept of querying is super close to Prometheus too. Combined with profiling specific data structures, all of that makes Parca's storage well optimized for its workloads.

## Local storage

### In-Memory layout

All of Parca's storage is currently entirely in-memory.

### On-disk layout

Parca does not yet store any data persistently. Within the subsequent releases, Parca will get an experimental local on-disk storage layout that will allow it to save profiling data for days, weeks, and months.

## Retention

As of right now, Parca supports retention by garbage collecting chunks with a _max timestamp_ that is older than the specified retention. The stored metadata and profile trees aren't garbage collected and might be ever-growing during the lifetime of a Parca process. In the future, this limitation will be addressed and improved.

* `--storage-tsdb-retention-time=6h` allows to change the retention to a specific duration.

## Architecture

<center>

![Parca's Storage](/img/storage/storage.svg)

</center>

## Storing

### Write Requests

Requests to store profiles are either coming from Parca's scraper, which collects profiles by scraping a targets' HTTP endpoint or coming from a process that is writing into Parca directly, like the [Parca agent](parca-agent).

Upon receiving such a request, the profile exists as `[]byte`, and Parca uses [pprof's upstream parser](https://pkg.go.dev/github.com/google/pprof/profile#Parse) to parse and validate these profiles. This ensures that the profiles are valid pprof profiles but also that Parca is compatible with pprof.

### Transforming Profiles

When it comes to the size of profiles, they are mostly made up of metadata. Parca's storage was designed to store the profile's metadata as efficient as possible. Once the metadata has been taken care of, the profiles are left with values that can be stored in a time-series database (TSDB).

Once the profile is parsed, Parca is left with the [pprof Profile](https://pkg.go.dev/github.com/google/pprof/profile#Profile). For now, Sample, Mapping, Location, and Function are the most interesting fields.

```go
type Profile struct {
	// ...
	Sample            []*Sample
	Mapping           []*Mapping
	Location          []*Location
	Function          []*Function
	// ...
}
```

### Storing Profile Metadata

A _profile tree_ is built by iterating over all samples. While iterating over the samples, all the metadata gets extracted and inserted into the metadata storage. Then Parca turns the folded stack traces into a profile tree that's better suited for producing flame graphs.

The metadata can be described as all the `Locations`, their referenced `Mappings`, and `Lines` that include the `Functions`. Parca stores the metadata in a SQL database and caches the results for a faster lookup in the next iteration. Mappings, Locations, Lines, Functions are then only stored once, and as we advance, can be referenced.

> To learn more about these concepts, you can check out the [Parca Agent Design](/docs/parca-agent-design#transform-to-pprof) section.


For now, we're using a [SQLite in-memory](https://pkg.go.dev/modernc.org/sqlite) by default. We have the option to use an on-disk SQLite database. The underlying architecture allows us to extend the implementation to support an external SQL store as a metadata store.

The metadata store has a schema roughly like this:
<center>

![Parca's SQL Storage](/img/storage/sql-schema.png)

</center>

### Creating a Profile Tree

Going forward Parca has only values and their locations left.

```go
profile.Profile{
	Sample: []*profile.Sample{
		{Value: []int64{46}, Location: []*profile.Location{{ID: 0}}},
		{Value: []int64{25}, Location: []*profile.Location{{ID: 1}, {ID: 0}}},
		{Value: []int64{8},  Location: []*profile.Location{{ID: 2}, {ID: 1}, {ID: 0}}},
		{Value: []int64{17}, Location: []*profile.Location{{ID: 3}, {ID: 2}, {ID: 0}}},
		{Value: []int64{21}, Location: []*profile.Location{{ID: 4}, {ID: 0}}},
	},
}
```

<div style={{float: 'right'}}>
<img src="https://docs.google.com/drawings/d/1q-by0bBnzrGegxnzKxb5kGiLEpbp0y14I7nYDNJ0L7o/export/png"/>
</div>


Parca iterates over each sample and then each time walks a tree data structure based on the sample's location IDs. First Parca creates the root node with a location ID `0`. This node gets the value `46` assigned. Parca then looks at the next sample and inserts a new node with location ID `1` into the tree that becomes a child of the root node, setting its value to `25`. Doing this for every sample Parca ends up with a Profile Tree that can be visualized as follows.

### Inserting a Profile Tree

At last, the Profile Tree and its values need to be inserted into the TSDB for the given timestamp. Parca merges the Profile Tree into the existing tree for that time series.
Then for every node in the appended Profile Tree Parca accesses a map that holds the values as XOR chunks for every given node in the tree. To uniquely identify nodes, each node has a key that is build of strings from *locations*, *labels*, and *numlabels*.

### Chunks

The chunks for the values of the Profile Tree are XOR chunks. Originally XOR compression was introduced by [Facebook's Gorilla paper](http://www.vldb.org/pvldb/vol8/p1816-teller.pdf) in 2016 and has since been adopted by many systems across the industry. One of which is Prometheus since Prometheus v2.0. Parca uses an XOR chunk encoding for its values based on Prometheus' XOR chunk.

Over time inserting the given profile trees with their values the chunks will look something like this:

![](https://docs.google.com/drawings/d/17vG5XzFpWgrsVBBM2RxS4QokRz2PB9Zh0atAxwxrLto/export/svg)

| Key | t0   | t1   | t2   | t3   |
| --- | ---- | ---- | :--- | ---- |
| 0   | 46   | 47   | 35   | 46   |
| 1   | 25   | 26   | 19   | 30   |
| 2   | 8    | 9    |      |      |
| 3   | 17   | 17   | 19   | 19   |
| 4   | 21   | 21   | 16   | 16   |
| 7   | 0    | 0    | 0    | 11   |

Every key gets its values appended over time. The node with the location ID `7` only shows up in `t3` and therefore we have to pre-fill the chunk with 0 up until the point where we actually want to write the node's first value.

#### Sparseness

The node with the key `2` does not have any values for `t2` and `t3`, we don't store anything for these timestamps. Allocating no memory/disk for any sparse values at all. When reading values for `t2` and `t3` for this node we can return `0` as a value that is ignored by pprof.

### Storing Debug Information

Additionally, Parca exposes endpoints to ingest the debug information for executables and binaries; the sent data is associated with the unique build ID of the object files. And the profiles that have been received have the necessary information about the build IDs in [the mappings section](http://localhost:3000/docs/parca-agent-design#mappings). This enables Parca to find corresponding debug information during [the symbolization phase](/docs/symbolization).

The debug information store is nothing complicated; it's just a thin wrapper around [an object storage](https://en.wikipedia.org/wiki/Object_storage). For this, we used the battle-tested Thanos Object Storage engine. [There are several object storages that have been supported](https://thanos.io/tip/thanos/storage.md/#supported-clients). Parca uses [build ID](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/developer_guide/compiling-build-id)s as keys for stored debug information. And the values are [ELF object files](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/developer_guide/compiling-build-id). Before the Parca Agent uploads any object files, it makes sure that the files don't contain any executable byte code.

The Parca Agent utilizes this API and the storage to upload discovered debug information on the systems it encounters. It only uploads the information for the stack traces it collects. However, it is not reserved for the agent. For example, your CI could utilize the API and the storage if you don't want to deploy binaries with debug information in your production environments.

## Querying

After ingesting data, Parca holds the data in memory in a layout optimized for querying flame graphs.

### Query Language

Similar to Prometheus' [PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/) (Prometheus Query Language) Parca supports queries like `heap_inuse_space_bytes{job="parca"}` which can be rewritten to `{__name__="heap_inuse_space_bytes",job="parca"}`.

Every key value pair is called a _matcher_. These can contain `=` (equals), `!=` (not equals), `=~`(matches regex), `!~` (not matches regex) to match all the wanted series.

### Index

Parca creates an inverted index of all labels to their corresponding series when a new series is created.

Let's say, Parca has the following series with their given labels:

| ID   | Labels                                                    |
| ---- | --------------------------------------------------------- |
| 1    | `{__name__="heap_inuse_space_bytes",job="parca"}`         |
| 2    | `{__name__="heap_inuse_space_bytes",job="prometheus"}`    |
| 3    | `{__name__="profile_cpu_nanoseconds",job="parca"}`        |
| 4    | `{__name__="profile_cpu_nanoseconds",job="thanos-query"}` |

The inverted index (postings) gets these the individual labels passed an stores them in a data structure like this `map[string]map[string]Bitmap`. The first map has the label name as key and the second map the label value. The bitmap stores all the series IDs for that given label set, for this example we'll imagine this as an array of `uint64`.

The following is what the index would look like for the example above:

```json
{
  "__name__": {
    "heap_inuse_space_bytes": [1,2],
    "profile_cpu_nanoseconds": [3,4]
  },
  "job": {
    "parca": [1,3],
    "prometheus": [2],
    "thanos-query": [4]
  }
}
```

With this index Parca can now look up every matcher of the query to find the series IDs.

Let's say we query for `{__name__="heap_inuse_space_bytes"}`, Parca will look at the `__name__` map and then for `heap_inuse_space_bytes` within that, finding an array `[1,2]`. These series are then looked up by their ID and added to a slice of `[]Series`.

A slightly more interesting query would be `{__name__="heap_inuse_space_bytes",job="parca"}`. For the matcher `__name__="heap_inuse_space_bytes"` Parca has the series IDs `[1,2]` and for the matcher `job="parca"` Parca has the series IDs `[1,3]`. Because the query wants both the matchers to match Parca calculates the intersection of `[1,2]` and `[1,3]` which results in `[1]`.

#### Bitmaps

Instead of storing the series IDs as `[]uint64` Parca actually stores those series IDs for the index as [roaring Bitmaps](http://roaringbitmap.org/). These bitmaps are especially good at storing small and large cardinalities of IDs. Bitmaps are optimized for calculating the intersections, unions and differences, which is exactly what Parca needs to do with these IDs.

More specifically Parca uses [github.com/dgraph-io/sroar](https://github.com/dgraph-io/sroar) that has Roaring Bitmaps in Go, with the aim to have equality between in-memory representation and on-disk representation. Essentially serializing bitmaps to `[]byte` right away, which will it make easy to store on disk later on.

