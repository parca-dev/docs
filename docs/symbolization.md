# Symbolization

Symbolization can be defined as converting the machine addresses, which have been encountered in stack traces, in the ingested profiles, to the corresponding human-readable source code lines.

Parca does asynchronous symbolization. At the ingestion time, we traverse the profiles and store them in a particular store called the metadata store (check [Storing Profile Metadata](/docs/storage#storing-profile-metadata) for further information). In a predefined recurring interval (10 seconds by default), Parca goes through all the locations ingested and determines those that are symbolizable, but haven't been symbolized yet, and then attempts to symbolize these locations using the designated [debug information store](/docs/storage#storing-debug-information). Once Symbolized, the human readable form is used in visualizations when querying.

Let's check out what we mean by symbolizable profiles; first, we need to define the types of profiles we can encounter.

## Type of Profiles

**Native profiles** are those created from within the application code itself. They can have additional information and make use of runtime specific characteristics. For example, in Go, the goroutines profile describes which parts of the Go application caused how many goroutines to be created (and currently active). Additionally, native profiles tend to be well symbolized since the languages and runtimes have built-in functionality to resolve stack traces to a human-readable format.

**Generic profiles** in contrast, are collected using sampling mechanisms available in Linux, such as [perf](https://github.com/conprof/perfessor) or special [eBPF program](https://ebpf.io/)s. These profiles are great because they don't require any instrumentation, but in contrast, these types of profiles cannot have information of runtime specific characteristics. They can only profile generic things like CPU, allocations, network activity, disk I/O. One other advantage that generic profiles have over native profiles is that they can sample down into the kernel stack and offer even higher visibility than native profiling in that regard. Because of these advantages of generic profiles, we decided to create the [Parca Agent](https://github.com/parca-dev/parca-agent).

The asynchronous symbolization works with generic profiles because the native profiles usually come symbolized as we mentioned above, and native profiles just get ingested with their symbols to metadata store to be utilize later on.

## What can be symbolized?

### Kernel symbols

Parca Agent provides the Kernel symbols. Parca Agent immediately symbolizes kernel stack traces when it instruments the system since the Kernel can have a dynamic memory layout (for example, loaded eBPF programs in addition to the static kernel pieces, as well as [KASLR](https://en.wikipedia.org/wiki/Address_space_layout_randomization#Kernel_address_space_layout_randomization)). Check [Parca Design Document](/docs/parca-agent-design#kernel-symbols) for further information.

### Application symbols

Parca Agent extracts debug symbols from the binaries or shared libraries/objects that contain the debug information and uploads them to the remote [debug information store](/docs/storage#storing-debug-information). This separation allows the debug symbols to be uploaded independently if the symbols are stripped in a CI process or retrieved from symbol servers such as [debuginfod](https://sourceware.org/elfutils/Debuginfod.html), [Microsoft symbol server](https://docs.microsoft.com/en-us/windows-hardware/drivers/debugger/microsoft-public-symbols), or [others](https://getsentry.github.io/symbolicator/). Parca soon will have support for these public debug information servers during symbolization.

The languages that have runtimes (e.g. interpreted languages or languages with VMs and JIT compilers) must be instrumented natively and provide native profiles that have already resolved symbols in their pprof profiles since their dynamic nature; addresses cannot be guaranteed to be stable to symbolized in a deferred manner.

## Debug Information from binaries

In Parca Agent, we check the running binaries debug information (i.e [DWARF](https://en.wikipedia.org/wiki/DWARF)) and the running system for additional debug information (e.g. [debug packages](https://wiki.ubuntu.com/Debug%20Symbol%20Packages)), and then upload this information to the Parca for further symbolization of the profiles. You can check out additional details on the debug information store in [the storage document](/docs/storage#storing-debug-information).

## Language Specific Support

### Go

Go has [a specific type of symbol table](https://github.com/DataDog/go-profiler-notes/blob/main/stack-traces.md#gopclntab), which is included in the binaries by default. If the binary doesn't have the necessary debug information, Parca Agent uploads this to the debug information store, and Parca does its best to symbolize the profiles from these binaries.

### Others

We are constantly working on language support. Please stay tuned for support for your language of choice.
