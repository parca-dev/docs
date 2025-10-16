# Profiling Rust Memory Usage with Jemalloc

Our jemalloc integration makes it possible to profile heap usage of
Rust programs, as long as you are willing to use the jemalloc
allocator.

# Setup Instructions

## Using jemalloc and rust-jemalloc-pprof

Add the
[jemalloc_pprof](https://crates.io/crates/jemalloc-pprof)
and [tikv-jemallocator](https://crates.io/crates/tikv-jemallocator)
packages to your project. Make sure the latter has the `profiling` and
`unprefixed_malloc_on_supported_platforms` features:

``` bash
cargo add jemalloc_pprof
cargo add tikv-jemallocator --features profiling,unprefixed_malloc_on_supported_platforms
```

Then, in your program's `main.rs` set your global allocator to
jemalloc and configure it with the special `malloc_conf` symbol:

``` rust
#[global_allocator]
static ALLOC: tikv_jemallocator::Jemalloc = tikv_jemallocator::Jemalloc;

#[unsafe(export_name = "malloc_conf")]
#[allow(non_upper_case_globals)]
pub static malloc_conf: &[u8] = b"prof:true,prof_active:true,lg_prof_sample:19\0";
```

## Exposing pprof profiles with http:

Call the `dump_pprof` method to dump profiles to memory. We
recommending exposing an HTTP interface for these profiles that can be
scraped by Parca.

Here is how to do so using Axum:

``` rust
async fn handle_get_heap() -> Result<impl IntoResponse, (StatusCode, String)> {
    let mut prof_ctl = jemalloc_pprof::PROF_CTL
        .as_ref()
        .ok_or((
            StatusCode::INTERNAL_SERVER_ERROR,
            "Profiling not available".to_string(),
        ))?
        .lock()
        .await;

    let pprof = prof_ctl
        .dump_pprof()
        .map_err(|err| (StatusCode::INTERNAL_SERVER_ERROR, err.to_string()))?;

    Ok(pprof)
}

fn main() {
    let app = Router::new().route("/debug/pprof/heap", get(handle_get_heap));

    let rt = Runtime::new().unwrap();

    rt.spawn(async {
        let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
            .await
            .expect("Failed to bind to port 3000");
        axum::serve(listener, app).await.expect("Server failed");
    });
}

```

## Uploading symbols with `parca-debuginfo` (only if not using
`parca-agent`).

If you are already using `parca-agent`, all relevant symbols will be
found and uploaded to the backend automatically. Otherwise, you will
need to manually upload them using the `parca-debuginfo` CLI. For example,
assuming Parca is running on localhost:

``` bash
parca-debuginfo upload --store-address=localhost:7070 --insecure path/to/your/binary
```

## Scraping with Parca

In order to continually scrape the endpoint, add a stanza like the
following to your `parca.yaml`, assuming (as in the example above) the
profiles are being served via HTTP on `127.0.0.1:3000`:

``` yaml
scrape_configs:
  - job_name: "rjemp"
    scrape_interval: "10s"
    static_configs:
      - targets: [ '127.0.0.1:3000' ]
    profiling_config:
      pprof_config:
        heap:
          enabled: true
          path: /debug/pprof/heap
```

This should cause profiles to appear in the Parca UI.
