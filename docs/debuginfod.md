# debuginfod client

In order to symbolize ingested profiles, Parca needs to have debug information
for the binaries that are being profiled. Debug information, also
referred to as _debuginfos_, can be ELF object files, DWARF debug data, and
source code. However, sometimes, application packages distributed by various Linux
distros [strip](https://man7.org/linux/man-pages/man1/strip.1.html) away debug
information to minimize the size of the binaries. Thankfully, there are publicly accessible
servers, distributing debug information for various Linux package managers and distributions.

debuginfod is an HTTP file server that serves debug information to clients
based on the build IDs of the binaries. You can find out the build ID of a
binary using the `file` command on Linux. Here is an example to find out the
build ID of a zsh shell:

```
$ file /bin/zsh

/bin/zsh: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=24fcd0179bb3aa797de6a570c2359e528f7638c0, for GNU/Linux 3.2.0, stripped
```
Parca integrates with debuginfod to query for upstream debuginfod files and then
stores them for potential later use. The default debuginfod server used by Parca is
at https://debuginfod.elfutils.org .

# Implementation

Primarily, Parca looks for the relevant debug information files in its default
symbol store. However, if debug info files are not found in the symbol store,
Parca will try to fetch corresponding debuginfo files from the upstream
debuginfod servers, and store them in the Parca symbol store, associated with
the unique build ID of the object files.

The symbol store is a wrapper around the [Parca object store](https://www.parca.dev/docs/storage#storing-debug-information)
to hold debug information. By default, Parca is configured to use the `/tmp`
directory on local disk. This can be reconfigured to use any other user-specified
location by editing the Parca configuration file.

The debuginfod client is implemented as a read-through client storage cache.
An HTTP client is implemented to send requests to the upstream debuginfod servers.
The client queries the server addresses sequentially until it finds the suitable
debuginfo files. The downloaded object files are then stored in a `parca/debuginfod`
bucket with the build ID as the key.

Users can add private debuginfod servers to be queried through the
` --debuginfod-upstream-servers` flag.
