# Overview

The Parca project houses two primary components, the Parca server, and the Parca Agent. This page dives further into the details of the Parca server.

If you haven't already, it is a good idea to read the [general overview](./overview) before diving into the details of the Parca server.

## Architecture

<p align="center">
  <img alt="Parca Architecture Overview" src="https://docs.google.com/drawings/d/1EAyMTbt-Ajf0KIzAFqjQdZNzjUnrm3NCH9922aOS4pI/export/svg" alt="drawing" width="600" />
</p>

Parca has a purpose built storage, which receives writes either from a pull mechanism that performs HTTP requests, or through a push mechanism via the gRPC API. Parca features two gRPC APIs for pushing data, one for the profiles themselves and one for [debuginfo](https://en.wikipedia.org/wiki/DWARF) metadata. Parca Agent uses the two APIs to minimize the amount of data transferred, it checks that metadata is uploaded only once, and otherwise only the measures statistics are sent.

Similar to the gRPC APIs, the storage is implemented to handle the two separate concerns, one for storing the measured statistics, and one storing the metadata to make displaying the data human readable. Debuginfo blobs uploaded via the gRPC API are stored in a configurable object store, which for ease of use also contains an in-memory and local-filesystem backed implementations. Using the uploaded debuginfos, the symbolizer symbolizes the raw stack traces of native binaries asynchronously. For a deep dive on the storage and symbolization read the [storage](./storage) and [symbolization](./symbolization) documentation.

The [React](https://reactjs.org/) based Parca web UI uses gRPC-web to retrieve the data to visualize.
