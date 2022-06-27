# Configuration

Parca obtains configuration information via a YAML file.

The overall structure of a config file for Parca is as follows:

```yaml
debug_info:
  bucket:
    type: "FILESYSTEM"
    config:
      directory: "./tmp"
  cache:
    type: "FILESYSTEM"
    config:
      directory: "./tmp"

scrape_configs:
    # Section name, mandatory
  - job_name: "pr"
    # Set of query parameters with which the target is scraped.
    params: 
      # Name of keys with value(s)
      - key_1: ['value1', 'value2']
    # How frequently to scrape the targets of this scrape config.
    scrape_interval: "3s"
    # Timeout for scraping targets of this config.
    scrape_timeout: "5s"
    # URL scheme with which to fetch metrics from targets.
    scheme: https
    # Config for adding custom scrape endpoints.
    profiling_config:
      pprof_config:
        config_1: # Name of the profile.
          enabled: true
          path: /path/to/scrape
          # Add a query parameter '?seconds=<scrape-interval>' to the profile.
          delta: true
        config_2:
          enabled: true
          path: /another/path
      # String prefix to add to all paths specified in the pprof config.
      path_prefix: /debug
    # 
    static_configs:
     - targets: [ '127.0.0.1:7070' ]
    # Configuration for relabeling of target label sets.
    relabel_configs:
      - source_labels: __address__
        target_label: instance
```

See [Prometheus documentation](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#relabel_config) for details about relabelling.
