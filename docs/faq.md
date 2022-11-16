# FAQ

Frequently asked questions. If anything is unclear or not covered in the documentation, don't hesitate to [open an issue](https://github.com/parca-dev/parca/issues/new).

## What languages are supported?

Infrastructure-wide always-on automatic profiling with Parca Agent currently supports all compiled languages, e.g. C, C++, Rust, Go (with extended support for Go). [Further language support](https://github.com/parca-dev/parca-agent/issues?q=is%3Aissue+is%3Aopen+label%3Afeature%2Flanguage-support) is coming in the upcoming weeks and months.

Parca itself supports any [pprof](https://github.com/google/pprof) formatted profile. Any library or implementation that outputs valid pprof profiles is supported by Parca. More details about pprof client libraries for various languages can be found [here](https://www.parca.dev/docs/ingestion#pull-based).

## What overhead does always-on profiling have?

Parca Agent has been observed to have an overhead of less than 1% in CPU and less than 200 Mb memory (this can depend on the number of targets actively being profiled). More elaborate and reproducible reports coming soon.

## Since Parca Agent has to run as root for eBPF, what are the security considerations?

* The profiler source code is open source, so anyone can inspect the code that would be running as root on their servers.
* It is written in Go, a memory-safe language.
* Binaries and container images are fully reproducible, so users can ensure that the artifacts they are running are exactly the same as the those that are being distributed.

Read the docs on more in-depth explanations on [Parca Agent Security](./parca-agent-security).

## Does Parca have our binaries or code?

No. Profiling data is made up of statistics representing. For example, how much time the CPU has spent in a particular function, but the function metadata is decoupled from the actual executable and source code. Parca only ever gets to see the measured statistics and function name metadata.

Read the docs on [symbolization](https://www.parca.dev/docs/symbolization) to understand further why.

## What are the 0x7f79e7a26b10 memory addresses I see in profiles?

This means the Parca server is failed to symbolize the profile that it received. For the [generic profiles](/docs/symbolization#type-of-profiles), the function metadata is decoupled from the actual executable and source code. In this particular situation, Parca has the profile but not the metadata.

This problem could happen because of several reasons:

* If the location doesn't have any mapping, the process might have disappeared before the profiling interval was over. As a result, we didn't even get the chance to read the /proc/PID/maps file.

* If there are Go runtime stack entries, such as `runtime.mstart` or `runtime.sysmon`, then this is the Linux Kernel walking the Go runtime stack too far.

* If your executable or the libraries that your executable uses do not include the debug information.

> To solve the last one, either you can provide the debug information in your environment (by recompiling the binary with debug info), or [you can upload additional object files that include the debug information for your executables to Parca server](https://buf.build/parca-dev/parca/docs/main/parca.debuginfo.v1alpha1). We have created an auxiliary tool called [`parca-debug-info`](/docs/debuginfo-cli) to ease-up the process.

* If the asynchronous symbolization hasn't worked yet. This could happen freshly ingested profiles.

> Please read the docs on [symbolization](https://www.parca.dev/docs/symbolization) to understand how it works.

## What happened to Conprof?

The Parca project is the continuation of Conprof. Parca already includes almost all the features and builds more on top of Conprof.
Conprof, as of we open-sourced Parca, is archived, and there won't be any future development on it. And all the relevant issues are migrated to Parca.
You can still find Conprof under [https://github.com/parca-dev/conprof-archived](https://github.com/parca-dev/conprof-archived).

The migration from Conprof to Parca should be painless for an end-user. Especially considering they both share the exact same discovery mechanism.
If you have a dependency on the API as a developer, unfortunately, they are not 100% compatible.
Please let us know if you need any help in case of a migration.
