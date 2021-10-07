# Overview

Parca is a continuous profiling project. Continuous profiling is the act of taking profiles (such as CPU, Memory, I/O and more) of programs in a systematic way. Parca collects, stores and makes profiles available to be queried over time.

## Features

Parca's main features are:

* a multi-dimensional data model with series of profiles identified by the profile type and key/value pairs
* a label-selector based query language
* query engine specifically designed for profiling data
* optimized, built-in storage
* support for pushing and pulling profiles from targets
* targets are discovered via service discovery or static configuration
* super low overhead profiler, powered by [eBPF](https://ebpf.io/)

## What is profiling?

Profiles describe a particular aspect of the execution of code. There are two main types of profiles: tracing and sampling. Parca focuses on sampling profiling, because it can be done with very little overhead, and therefore can always be on in production environments. Probably the most common type of profiling is CPU profiling, the amount of time the CPU spends executing particular piece of code. Profilers can vary in their resolution and whether they just record the function name or also the line numbers. Profiling types, other than CPU profiling, can include memory allocations, or breaking down how much memory is currently being held by a program, typically referred to as heap profiling. It may also be useful to have runtime specific profiling, such as in Go, there is goroutine profiling.

Raw data for sampling profiles are stack-traces, as well as values attached to those stack-traces.

Learn more about how profiling works in the [Profiling 101 documentation page](./profiling-101).

## What is continuous profiling?

As mentioned to above, sampling profiling can be achieved with very low overhead, therefore it can always be on in production. However, because of the nature of sampling profiling, it is possible that some parts of an execution are missed, therefore continuous profiling attempts to gather data continuously, so that with enough data it is statistically significant.

Simply said, much like with any other observability data, you never know at which point in time you are going to need profiling data, so always collect it at low overhead.

## When is continuous profiling useful?

There are more potential use cases, but the three that are most common are:

* Saving money: Statistically significant insight into what code causes the most resources to be used, allows engineers to optimize those pieces and be confident, that resource usage will be lower after optimizing.
* Understand difference: Always collecting data from all processes allows comparing why execution of code was different in time, across processes or even versions of code (Parca's powerful multi-dimensional model allows comparing profiling data on any label dimension).
* Understand incidents: Collecting data in the past allows us to understand incidents even after they have happened and without manual capturing of profiling data.

## Components

The Parca project houses two main components:

* Parca: The server that stores profiling data and allows it to be queried and analyzed over time.
* Parca Agent: An eBPF based profiler, that can automatically discover targets to profile such as Kubernetes containers or systemd units.

## Architecture

This diagram illustrates the architecture of Parca and Parca Agent.

![Parca Architecture Overview](https://docs.google.com/drawings/d/10VH49EgWlNF1wONKroQb5x3Q1Rkrnsc1BikTUvJNFIE/export/svg)

Profiles can be sourced either by an agent, such as Parca Agent, pushing profiles to Parca, or the Parca server pulling profiles from targets via HTTP. [Go has popularized having HTTP endpoints to request profiles](https://pkg.go.dev/net/http/pprof) from. When pushed or pulled, the profiles are written to Parca's purpose-built storage (read more in-depth details in the [storage documentation](./storage)).

Series of profiles in Parca are identified by their unique label combination. Parca has a rich set of [gRPC](https://grpc.io/) APIs, Parca's web UI uses [gRPC-web](https://grpc.io/docs/platforms/web/basics/) to communicate with the backend. Using the Parca UI a user can query profiles and visualize them using icicle-graphs (upside-down [flamegraphs](https://twitter.com/brendangregg/status/527214217007362049?lang=en)).

## What does the name "Parca" mean?

It plays on the [Program for Arctic Regional Climate Assessment (PARCA)](https://nsidc.org/data/parca) and the practice of ice core _**profiling**_ that has been done as part of it to study climate change. Hopefully with this open source project we can reduce some carbon emissions produced by unnecessary resource usage of data centers.
