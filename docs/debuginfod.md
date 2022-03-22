# debuginfod client

In order to symbolize ingested profiles, Parca needs to have debug information
for the binaries _(which binaries?)_ that are being profiled. Debug information
can typically comprises ELF object files, DWARF debug data, and source code
required for symbolization. However, sometimes, production codebases use
compiler optimisations which strip the debug information from the binaries.
Thankfully, there are public vendor distributed servers which make distro
specific debug info files avaialble to the community.

debuginfod is an eifutils file server that serves debug information to clients
across http. Parca has a custom debuginfod client for querying upstream
debuginfod files and then storing them _(locally)_ for potential later use.

# Architecture


Primarily, Parca looks for the relevant debug information files in its default
symbol store. However, if debug info files are not found in the symbol store,
Parca will try to fetch corresponding debuginfo files from the upstream
debuginfod servers, and store them in the Parca symbol store, associated with
the unique build id of the object files.

The symbol store is a wrapper around the [Parca cloud object store](https://www.parca.dev/docs/storage#storing-debug-information) 
to hold debug information. By default, Parca is configured to use the local `/tmp`
directory. This can be easily reconfigured to use any other user-specified
local/cloud-store location by editing the `Parca/parca.yaml` file.

The debuginfod client is implemented as read-through client storage cache,
`DebugInfodClientObjectStorageCache`. An http client `HTTPDebugInfodClient`
is implemented to send requests to the upstream debuginfod servers. The client
queries the server addresses _(sequentially?)_ till it finds the suitable
debuginfo files. The downloaded object files are then stored in the corresponding
`parca/debuginfod/buildId` directory.

Users can add private debuginfod servers to be queried through the
` --debuginfod-upstream-servers` flag.
