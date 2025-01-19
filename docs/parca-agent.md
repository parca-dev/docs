# Overview

Parca Agent is an always-on sampling profiler that uses [eBPF](https://ebpf.io/) to capture raw profiling data with very low overhead. It observes user-space, and kernel-space stack traces 19 times per second and builds [pprof](https://github.com/google/pprof) formatted profiles from the extracted data. For in-depth detail and explanation refer to the the [Parca Agent Design](/docs/parca-agent-design) documentation.

The collected data can be viewed locally via HTTP endpoints and optionally be configured to be sent to a Parca server, where it can be queried and analyzed over time.

## Requirements

* Linux Kernel version 4.18+
* For Kubernetes metadata, a CRI that supports CRI v1 (for example containerd v1.6.x+)

## Supported Profiles

Profiles available for compiled languages (e.g. C, C++, Go, Rust):

* CPU
* Soon: network usage, memory allocations

Runtime-specific information, such as Goroutines, requires manual instrumentation.

## Tutorials

You can find a tutorial for each of the target discovery mechanisms below (each of these also contain a Parca server setup):

* [Parca On Kubernetes](/docs/kubernetes) (if you are using [OpenShift](https://www.redhat.com/en/technologies/cloud-computing/openshift) refer to the separate [Parca On OpenShift](/docs/openshift) documentation)
* [systemd Unit Profiling](/docs/systemd)

## Troubleshooting

See [Troubleshooting Parca Agent](/docs/troubleshooting-parca-agent).
