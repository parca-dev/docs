# systemd Unit Profiling

:::tip

You can learn [how to run the Parca Agent binary](/docs/agent-binary). if you haven't already.

:::

You can run the Parca Agent as a `systemd` unit with the following simple configuration:
```toml

[Unit]
Description=Parca Agent

[Service]
Type=simple
User=root
Group=root

WorkingDirectory=/WORKING_DIRECTORY/parca-agent
ExecStart=/WORKING_DIRECTORY/dist/parca-agent --http-address=":7072" --node=systemd-test --systemd-units=docker.service,parca-agent.service --log-level=debug --kubernetes=false --store-address=localhost:7070 --insecure

Restart=on-failure
RestartSec=10

StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=parcaagent

[Install]
WantedBy=multi-user.target
```

The command in the above configuration targets the Parca server that is presumably running on your system. And it uses the `systemd` service discovery to find the cgroups that have been running on your system.

To use the configuration, we need to move it a directory that `systemd` can load:
```shell
cp parca-agent.service /etc/systemd/system/parca-agent.service
```

And then simply start the unit:
```shell
sudo systemctl start parca-agent
```

The `systemd` service will be collecting profiles from `docker.service` and `parca-agent.service` that have been running on your system.
