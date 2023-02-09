# Language Support

Support in Parca Agent for various languages is constantly improving, here are some indications and examples to help you get started. 

## Ahead-of-time (AOT) compilation

All AOT compiled languages with [debug info](./symbolization#what-can-be-symbolized), and frame pointer or DWARF unwinding information:

* [C](https://github.com/parca-dev/parca-demo/tree/main/c)
* [C++](https://github.com/parca-dev/parca-demo/tree/main/cpp)
* [Go](https://github.com/parca-dev/parca-demo/tree/main/go) (with [extended support](./symbolization#go))
* [Rust](https://github.com/parca-dev/parca-demo/tree/main/rust)
* And more

## Just-in-time (JIT) compilation

All JIT compiled languages with frame pointer, and [Perf map](https://github.com/torvalds/linux/blob/master/tools/perf/Documentation/jit-interface.txt) or [jitdump](https://github.com/torvalds/linux/blob/master/tools/perf/Documentation/jitdump-specification.txt):

* [.NET](https://github.com/parca-dev/parca-demo/tree/main/dotnet)
* [Deno](https://github.com/parca-dev/parca-demo/tree/main/deno)
* [Erlang](https://github.com/parca-dev/parca-demo/tree/main/erlang)
* [Java](https://github.com/parca-dev/parca-demo/tree/main/java)
* [Julia](https://github.com/parca-dev/parca-demo/tree/main/julia)
* [Node.js](https://github.com/parca-dev/parca-demo/tree/main/nodejs)
* [PHP 8 and above](https://github.com/parca-dev/parca-demo/tree/main/php)
* [Python 12 and above](https://github.com/parca-dev/parca-demo/tree/main/python)
* [Wasmtime](https://github.com/parca-dev/parca-demo/tree/main/wasmtime)
* And more

## Interpreted

_Coming soon_

## Coming Soon

* Extended support for JVM runtimes via [async-profiler](https://github.com/jvm-profiling-tools/async-profiler)

:::info

[Further language support](https://github.com/parca-dev/parca-agent/issues?q=is%3Aissue+is%3Aopen+label%3Afeature%2Flanguage-support) is coming in the upcoming weeks and months.

:::
