# Parca from Binary

You can download the latest binary release for your architecture from our [releases page](https://github.com/parca-dev/parca.dev/releases)

We also produce Docker images that can be pulled:
```
docker pull ghcr.io/parca-dev/parca:latest
```

We provide an example configuration file that you can use to get Parca running, and the scrape configuration section should look familiar to anyone familiar with Prometheus.
```
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
  - job_name: "default"
    scrape_interval: "1s"
    static_configs:
      - targets: [ '127.0.0.1:7070' ]
```

To start Parca, pass this config file with the `config-path` flag:
```
parca --config-path="parca.yaml"
```

You should be greeted with the splash and some log lines:
```
ooooooooo.
`888   `Y88.
 888   .d88'  .oooo.   oooo d8b  .ooooo.   .oooo.
 888ooo88P'  `P  )88b  `888""8P d88' `"Y8 `P  )88b
 888          .oP"888   888     888        .oP"888
 888         d8(  888   888     888   .o8 d8(  888
o888o        `Y888""8o d888b    `Y8bod8P' `Y888""8o



{"caller":"log.go:124","level":"info","msg":"loading bucket configuration","name":"parca","ts":"2021-09-16T01:13:18.874904009Z"}
{"caller":"log.go:124","level":"debug","msg":"Starting provider","name":"parca","provider":"static/0","subs":"[default]","ts":"2021-09-16T01:13:18.876115335Z"}
{"addr":":7070","caller":"server.go:84","level":"info","msg":"starting server","name":"parca","ts":"2021-09-16T01:13:18.876178645Z"}
{"caller":"log.go:124","level":"debug","msg":"Discoverer channel closed","name":"parca","provider":"static/0","ts":"2021-09-16T01:13:18.876192954Z"}
```

This will start the Parca server on port `7070` and configure it to retrieve profiles from itself every 1 second automatically.

Other flags can be found using the `help` flag.
```
parca --help

Usage: parca

Flags:
  -h, --help                              Show context-sensitive help.
      --config-path="parca.yaml"          Path to config file.
      --log-level="info"                  log level.
      --port=":7070"                      Port string for server
      --cors-allowed-origins=CORS-ALLOWED-ORIGINS,...
                                          Allowed CORS origins.
      --otlp-address=STRING               OpenTelemetry collector address to send traces to.
      --storage-tsdb-retention-time=6h    How long to retain samples in storage.
```

Once Parca is running, you can navigate to the web interface on the browser.

![image](https://user-images.githubusercontent.com/8681572/133893063-8cc9fc8a-4d55-431d-80fc-6a2fe8de7019.png)


You should shortly see the `Select profile...` dropdown menu populate with the profiles that Parca is retrieving from itself.
Selecting one of these profile types and clicking the `Search` button will retrieve the profiles of that type for the time selection (default Last Hour)

![image](https://user-images.githubusercontent.com/8681572/133893237-f069a552-e928-4065-80db-603fb5f85e6a.png)

This should result in a time series based on the profile that is interactable. Clicking anywhere on the line graph should then bring up an icicle graph for the profile that you've selected.

![image](https://user-images.githubusercontent.com/8681572/133893258-96fdbc0a-8036-4d89-bb4c-578fb131c8e0.png)

You can then interact with the icicle graph to better understand how Parca is behaving.
