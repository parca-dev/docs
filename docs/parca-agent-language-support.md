# Language Support

Parca Agent is continuously enhancing its support for multiple languages.
To assist you in getting started, here are some guidelines and sample use cases.

## Ahead-of-time (AOT) compilation

All AOT compiled languages with [debug info](./symbolization#what-can-be-symbolized), and frame pointer or DWARF unwinding information:

- [C](https://github.com/parca-dev/parca-demo/tree/main/c)
- [C++](https://github.com/parca-dev/parca-demo/tree/main/cpp)
- [Go](https://github.com/parca-dev/parca-demo/tree/main/go) (with [extended support](./symbolization#go))
- [Rust](https://github.com/parca-dev/parca-demo/tree/main/rust)
- And more

## Just-in-time (JIT) compilation

All JIT compiled languages with frame pointer, and [Perf map](https://github.com/torvalds/linux/blob/master/tools/perf/Documentation/jit-interface.txt) or [jitdump](https://github.com/torvalds/linux/blob/master/tools/perf/Documentation/jitdump-specification.txt):

- [.NET](https://github.com/parca-dev/parca-demo/tree/main/dotnet)
- [Deno](https://github.com/parca-dev/parca-demo/tree/main/deno)
- [Erlang](https://github.com/parca-dev/parca-demo/tree/main/erlang)
- [Java](/docs/java-support)
- [Julia](https://github.com/parca-dev/parca-demo/tree/main/julia)
- [Node.js](https://github.com/parca-dev/parca-demo/tree/main/nodejs)
- [PHP 8 and above](https://github.com/parca-dev/parca-demo/tree/main/php)
- [Wasmtime](https://github.com/parca-dev/parca-demo/tree/main/wasmtime)
- And more

## Interpreted

- Ruby
- [Python](https://github.com/parca-dev/parca-demo/tree/main/python)

:::info

[Further language support](https://github.com/parca-dev/parca-agent/issues?q=is%3Aissue+is%3Aopen+label%3Afeature%2Flanguage-support) is coming in the upcoming weeks and months.

:::
