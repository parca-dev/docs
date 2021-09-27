# Observability for Parca

Parca supports four pillars of Observability. Monitoring, Logging, Tracing, and Profiling.

## Profiling

Parca by default scrapes its own pprof endpoints on [localhost:7070/debug/pprof](http://localhost:7070/debug/pprof).
The different types of profiles are available via Parca's UI.

## Logging

Parca logs are structured by default. Parca's log level can be configured with `--log-level="info"`.

## Tracing

Parca has tracing for some of its functionality. You can configure the OpenTelemetry collector with `--otlp-address=STRING`. 

For a local setup with Jaeger check [scripts/local-tracing/](https://github.com/parca-dev/parca/tree/main/scripts/local-tracing).

## Monitoring

Parca exposes Prometheus metrics on [localhost:7070/metrics](http://localhost:7070/metrics).

Parca's monitoring is mostly focused on read and write requests to Parca.
For that reason the `grpc_server_handled_total` is the most important metric for Parca and most of the other metrics and helpful for debugging overall.

### Service Level Objectives

Here are some example Service Level Objectives for Parca.

| Category        | SLI                                                          | SLO                              |
| --------------- | ------------------------------------------------------------ | -------------------------------- |
| **Write**       |                                                              |                                  |
| Availability    | The proportion of successful `ProfileStoreService.WriteRaw` requests (such as from Parca agent), as measured by Parca's gRPC metrics interceptor. | 99.9% in  4w                     |
| Latency         | The proportion of sufficiently fast requests to `ProfileStoreService.WriteRaw`, as measured by Parca's gRPC metrics interceptor. | 95% of requests in < 100ms in 4w |
| **DebugInfo**   |                                                              |                                  |
| Availability    | The proportion of successful `DebugInfoService.Upload` requests, as measured by Parca's gRPC interceptor. | 99% in 4w                        |
| Latency         | The proportion of sufficiently fast requests to `DebugInfoService.Upload`, as measured by Parca's gRPC metrics interceptor. | 95% of requests in < 30s in 4w   |
| Availability    | The proportion of successful `DebugInfoService.Exists` requests, as measured by Parca's gRPC interceptor. | 99% in 4w                        |
| Latency         | The proportion of sufficiently fast requests to `DebugInfoService.Exists`, as measured by Parca's gRPC metrics interceptor. | 95% of requests in < 100ms in 4w |
| **Query**       |                                                              |                                  |
| Availability    | The proportion of successful `QueryService.Query` requests, as measured by Parca's gRPC interceptor. | 99% in 2w                        |
| Latency         | The proportion of sufficiently fast requests to `QueryService.Query`, as measured by Parca's gRPC metrics interceptor. | 95% of requests in < 1s in 2w    |
| **QueryRange**  |                                                              |                                  |
| Availability    | The proportion of successful `QueryService.QueryRange` requests, as measured by Parca's gRPC interceptor. | 99% in 2w                        |
| Latency         | The proportion of sufficiently fast `QueryService.QueryRange` requests, as measured by Parca's gRPC metrics interceptor. | 95% of requests in < 100ms in 2w |
| **QueryLabels** |                                                              |                                  |
| Availability    | The proportion of successful Query Labels requests to Parca, as measured by Parca's gRPC interceptor. | 99% in 2w                        |
| Latency         | The proportion of sufficiently fast Query Labels requests handled by Parca, as measured by Parca's gRPC metrics interceptor. | 95% of requests in < 100ms in 2w |

Parca considers gRPC codes `Aborted, Unavailable, Internal, Unknown, Unimplemented, DataLoss` as errors. Every other gRPC code is considered successful.

#### Pyrra 

Parca contains [Service Level Objective files](https://github.com/parca-dev/parca/tree/main/deploy/pyrra) for [Pyrra](https://github.com/pyrra-dev/pyrra). Pyrra will setup alerting based on the given SLOs and contains a UI for the most important aspects of these SLOs.

![Parca Pyrra example SLO](/img/pyrra.png)

### Grafana Dashboard

Parca ships with a [Grafana dashboard](https://github.com/parca-dev/parca/blob/main/deploy/grafana/parca.json) that gives a good overview of Parca's state and should be a good entry point when trouble shooting. 
This dashboard should follow the above given SLOs for Parca.  

![Parca Grafana dashboard](/img/grafana.png)

