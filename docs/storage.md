# Storage

Parca's Time Series Database (TSDB) was heavily influenced by Prometheus' TSDB. In fact, in a lot of places we simply use Prometheus packages to not re-invent the wheel and be consistent with the way Prometheus works.

To give you an example, labels and label matchers are entirely used via Prometheus packages and we didn't write this functionally ourselves, so it'll be exactly how you know it from Prometheus.

As for the storage itself, we've followed Prometheus' storage in a lot of ways too. We have an in-memory head that all new samples are appended too, we have have almost the same chunks to which samples are written and concepts of querying are super close to Prometheus too.

## Local storage

### In-Memory layout

All of Parca's storage is currently entirely in-memory.

### On-disk layout

Parca does not yet store any data persistently. Within the next releases we're going to work on a local on-disk storage layout that allows to save profiling data for days, weeks, and months.

## Retention

As of right now Parca supports retention by garbage collecting chunks that have a _max timestamp_ that is older than the specified retention. The stored meta data and profile trees aren't garbage collected and might be ever growing during the life time of a Parca process. We want to address this limitation in the future.

* `--storage-tsdb-retention-time=6h` allows to change the retention to a specific duration.

## Architecture

<center>

![Parca's Storage](/img/storage/storage.svg)

</center>


### Write Requests

Requests to store profiles are either coming from Parca's scraper that collected profiles by scraping a targets' HTTP endpoint or the requests come from a process writing into Parca directly, like for example the [Parca agent](parca-agent).

Upon receiving such a request the profile exists as `[]byte` and we use [pprof's upstream parser](https://pkg.go.dev/github.com/google/pprof/profile#Parse) to parse and validate these profiles. This will always make sure that the profiles are valid pprof profiles but also Parca is compatible with pprof. 

### Transforming Profiles

Profiles are mostly made of meta data, when it comes to their size. Parca's storage was designed to store the profile's meta data as efficient as possible. Once the meta data has been taken care of the profiles are left with values that can be stored in a time-series data base (TSDB).

Once the Profile is parsed we're left with the [pprof Profile](https://pkg.go.dev/github.com/google/pprof/profile#Profile) where for now we're mostly interested in Sample, Mapping, Location, and Function.

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

### Storing Profile Meta Data

We iterate over all Samples, within those we iterate over all Locations, their referenced Mappings and Lines with Functions. By doing so we build the in-memory tree representation of each folded stack trace that was flattened in the pprof profile.

While having to look at each Mapping, Location, Line, and Function we store their values in a SQL data store and cache the results for faster lookup in the next iteration. Mappings, Locations, Functions are then only stored once and going forward they are only referenced. 

For now we're using a [SQLite in-memory](https://pkg.go.dev/modernc.org/sqlite) SQL store with a schema roughly like this:
<center>

![Parca's SQL Storage](/img/storage/sql-schema.png)

</center>
