# Java Support

In order for Parca Agent to be able to make sense of the just-in-time compiled code by the Java VM, the Java process needs to comply to the [linux kernel perf jit-interface](https://github.com/torvalds/linux/blob/master/tools/perf/Documentation/jit-interface.txt). To do this, currently users need to start their java process with two flags `-XX:+PreserveFramePointer` and `-agentpath:/your/path/to/libperfmap.so` where the `libperfmap.so` agent can be downloaded [here](https://github.com/parca-dev/perf-map-agent/releases/tag/v0.0.1).

Checkout the [demo example](https://github.com/parca-dev/parca-demo/tree/main/java) for more details.

## Coming soon

More integrated support without the need of perf-map agent and frame pointers for JVM runtimes using [async profiler](https://github.com/async-profiler/async-profiler)
