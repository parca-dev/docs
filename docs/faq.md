# FAQ

Frequently asked questions. If anything is unclear or not covered in the documentation, don't hesitate to [open an issue](https://github.com/parca-dev/parca/issues/new).

## What languages are supported?

Infrastructure-wide always-on automatic profiling with Parca Agent currently supports all compiled languages, eg. C, C++, Rust, Go (with extended support for Go). [Further language support](https://github.com/parca-dev/parca-agent/issues?q=is%3Aissue+is%3Aopen+label%3Afeature%2Flanguage-support) coming in the upcoming weeks and months.

Parca itself supports any [pprof](https://github.com/google/pprof) formatted profile. Any library or implementation that outputs valid pprof profiles is supported by Parca.

## What overhead does always-on profiling have?

Parca Agent has been observed to have an overhead of less than 1% in CPU and less than 200 Mb memory (this can depend on the number of targets actively being profiled). More elaborate and reproducible reports coming soon.

## Since Parca Agent has to run as root for eBPF, what are the security considerations?

* The profiler source code is open source, so anyone can inspect the code that would be running as root on their servers.
* It is written in Go, a memory-safe language.
* Binaries and container images are fully reproducible, so users can ensure that the artifacts they are running are exactly the same as the those that are being distributed.

Read the docs on more in-depth explanations on [Parca Agent Security](./parca-agent-security).

## Does Parca have our binaries or code?

No. Profiling data is made up of statistics representing for example how much time the CPU has spent in a particular function, but the function metadata is decoupled from the actual executable and source code. Parca only ever gets to see the measured statistics and function name metadata.

Read the docs on [symbolization](https://www.parca.dev/docs/symbolization) to understand further why.
