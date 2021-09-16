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

A _profile tree_ is built by iterating over all Samples, within those samples iterating over all Locations, their referenced Mappings and Lines that include the Functions. Parca turns the folded stack traces into a profile tree that's better suited for producing flame graphs.

While working on each Mapping, Location, Line, and Function, Parca stores these in a SQL data store and caches the results for faster lookup in the next iteration. Mappings, Locations, Lines, Functions are then only stored once and going forward, and they can be referenced.

For now, we're using a [SQLite in-memory](https://pkg.go.dev/modernc.org/sqlite) SQL store with a schema roughly like this:
<center>

![Parca's SQL Storage](/img/storage/sql-schema.png)

</center>
