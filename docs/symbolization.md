# Symbolization

Symbolization can be defined as converting the machine addresses, which have been encountered in stack traces in the ingested profiles, to the corresponding human-readable source code lines.

Parca does asynchronous symbolization. At the ingestion time, we traverse the profiles and store them in a particular store called the metadata store (check [Storing Profile Metadata](https://parca.dev/docs/storage#storing-profile-metadata) for further information). In a predefined recurring interval (10 seconds by default), Parca goes through all the locations ingested and determines the symbolizable and haven't been symbolized yet, And then attempts to symbolize these locations using the designated [debug information store](https://parca.dev/docs/storage#storing-debug-information).

Let's check out what we mean by symbolizable profiles; for that, we need to define the types of profiles we can encounter.

## Type of Profiles

**Native profiles** are those created from within the application code itself. They can have additional information and make use of runtime specific characteristics. For example, in Go, the goroutines profile describes which parts of the Go application caused how many go-routines to be created (and currently active). Additionally, native profiles tend to be well symbolized since the languages and runtimes have built-in functionality to resolve stack traces to a human-readable format.

**Generic profiles** in contrast, are collected using sampling mechanisms available in Linux, such as perf or special eBPF programs. These profiles are great because they don't require any instrumentation, but in contrast, these types of profiles cannot have information of runtime specific characteristics. They can only profile generic things like CPU, allocations, network activity, disk I/O. One other advantage that generic profiles have over native profiles is that they can sample down into the kernel stack and offer even higher visibility than native profiling in that regard. Because of these advantages of generic profiles, we decided to create the Parca Agent.

The asynchronous symbolization works with generic profiles because the native profiles usually come symbolized, and they just get ingested with their symbols to metadata store.

## Sybolization

### Kernel symbols

The Parca Agent provides the Kernel symbols. The Parca Agent immediately symbolizes kernel stack traces when it instruments the system since the Kernel can have a dynamic memory layout (for example, loaded eBPF programs in addition to the static kernel pieces). Check [Parca Design Document](https://parca.dev/docs/parca-agent-design#kernel-symbols) for further information.

### Application symbols

The Parca Agent extracts debug symbols from the binaries or shared libraries/objects that contain the debug information and uploads them to the remote [debug information store](https://parca.dev/docs/storage#storing-debug-information). This separation allows the debug symbols to be uploaded independently if the symbols are stripped in a CI process or retrieved from symbol servers such as [debuginfod](https://sourceware.org/elfutils/Debuginfod.html), [Microsoft symbol server](https://docs.microsoft.com/en-us/windows-hardware/drivers/debugger/microsoft-public-symbols), or [others](https://getsentry.github.io/symbolicator/).

The languages that have runtimes (e.g. interpreted languages or languages with VMs and JIT compilers) must be instrumented natively and provide native profiles that have already resolved symbols in their pprof profiles since their dynamic nature; addresses cannot be guaranteed to be stable to symbolized in a deferred manner.

## Debug Information

### DWARF

#### binutils
 TODO
- objcopy
- ef-utils

### Language Specific Support
 TODO

#### Go
 TODO

### Public Symbol server support

Coming soon.
