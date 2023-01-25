# Ingestion

There are two ways to ingest data into Parca.

## Push based

The recommended way to use for generic profiling is Parca Agent. Parca Agent is an always-on sampling profiler that uses [eBPF](https://ebpf.io/) to capture raw profiling data with very low overhead. It observes user-space, and kernel-space stack traces 100 times per second and builds [pprof](https://github.com/google/pprof) formatted profiles from the extracted data. For in-depth detail and explanation refer to the the [Parca Agent Design](/docs/parca-agent-design) documentation.

The collected data can be [sent to a Parca server](https://buf.build/parca-dev/parca/docs/main/parca.profilestore.v1alpha1), where it can be queried and analyzed over time.

### Guides

* [Parca On Kubernetes](/docs/kubernetes) (if you are using [OpenShift](https://www.redhat.com/en/technologies/cloud-computing/openshift) refer to the separate [Parca On OpenShift](/docs/openshift) documentation)
* [systemd Unit Profiling with Parca Agent](/docs/systemd)

## Pull based

Another way Parca works, is by collecting profiles in [pprof](https://github.com/google/pprof) format from HTTP endpoints.
So all applications have to do is use one of the client libraries for pprof and expose an HTTP endpoint serving it.
Pprof client libraries exist for various languages:

| Language/runtime | CPU  | Heap | Allocations | Blocking | Mutex Contention | Extra |
|---|---|---|---|---|---|---|
| [Go](https://golang.org/pkg/net/http/pprof/) | Yes | Yes | Yes | Yes | Yes | Goroutine, [`fgprof`](https://github.com/felixge/fgprof) |
| [Rust](https://github.com/tikv/pprof-rs) | Yes | No | No | No | No |  |
| [Python](https://pypi.org/project/pypprof/) | Yes | Yes  | No | No | No |  |
| [NodeJS](https://github.com/google/pprof-nodejs) | Yes | Yes | No | No | No |  |
| [JVM](https://github.com/papertrail/profiler) | Yes | No | No | No | No |  |

### Guides

* [Instrument your Go app with pprof](/docs/instrumenting-go)

## Combining Push and Pull based Ingestion

Deploy the Parca Agent as described above. Additionally collecting profiles in [pprof](https://github.com/google/pprof) format from HTTP endpoints. 
If both are deployed the CPU profiles would be collected twice. Once by the Parca Agent and once by the Parca scraping the application's HTTP ednpoints.

To disable cpu profiling collections change the configuration:

```diff
scrape_configs:
  - job_name: "default"
    scrape_interval: "3s"
    static_configs:
      - targets: [ '127.0.0.1:7070' ]
+   profiling_config:
+     pprof_config:
+       process_cpu:
+         enabled: false
```


### Alternative approaches

Additionally, any [`perf`](https://perf.wiki.kernel.org/index.php/Main_Page) profile can be converted to pprof using [`perf_data_converter`](https://github.com/google/perf_data_converter), so even programs that do not have native support for pprof can benefit from continuous profiling with Parca. We do, however, recommend to use native instrumentation when possible, as it allows language and runtime specific nuances to be encoded in the respective libraries.

Once there is an HTTP endpoint that serves profiles in pprof format, all that needs to be done is to configure Parca to collect the profile in a regular interval. Configuration can be set in [`parca/parca.yaml`](https://github.com/parca-dev/parca/blob/main/parca.yaml). For `fgprof` profile collection, for example, the scrape configuration in the `parca.yaml` file could be set in the following manner: 

```diff
scrape_configs:
  - job_name: "default"
    scrape_interval: "60s"
    scrape_timeout: "45s"
    static_configs:
      - targets: [ '127.0.0.1:7070' ]
+   profiling_config:
+     pprof_config:
+       fgprof:
+         enabled: true
+         path: /debug/pprof/fgprof
```
