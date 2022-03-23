# debuginfod client

In order to symbolize ingested profiles, Parca needs to have debug information
for the binaries that are being profiled. Debug information
can typically comprises ELF object files, DWARF debug data, and source code
required for symbolization. However, sometimes, application packages distributed
by various Linux distros strip away debug information to minimize the size of
the binaries. Thankfully, there are public vendor distributed servers which make distro
specific debug info files available to the community.

debuginfod is an HTTP file server that serves debug information to clients
based on the build IDs of the packages. Parca has a custom debuginfod client for querying upstream
debuginfod files and then storing them for potential later use. The default
debuginfod server used by Parca is at https://debuginfod.systemtap.org .

# Architecture

Primarily, Parca looks for the relevant debug information files in its default
symbol store. However, if debug info files are not found in the symbol store,
Parca will try to fetch corresponding debuginfo files from the upstream
debuginfod servers, and store them in the Parca symbol store, associated with
the unique build id of the object files.

The symbol store is a wrapper around the [Parca object store](https://www.parca.dev/docs/storage#storing-debug-information)
to hold debug information. By default, Parca is configured to use the `/tmp`
directory on local disk. This can be easily reconfigured to use any other user-specified
location by editing the Parca configuration file.

The debuginfod client is implemented as a read-through client storage cache.
An HTTP client is implemented to send requests to the upstream debuginfod servers.
The client queries the server addresses sequentially until it finds the suitable
debuginfo files. The downloaded object files are then stored as a `parca/debuginfod/`.

Users can add private debuginfod servers to be queried through the
` --debuginfod-upstream-servers` flag.
