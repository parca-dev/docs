# Public Exposing Parca Write Endpoints

In case there is a need to run Parca Agent in a separate cluster or on some seperate system, there might be a need to publicly expose only the write endpoints from Parca without also opening up the UI to the world.

## Authentication

You might not want to expose the Parca Server without handling authentication. Currently the only supported auth mechanism is providing a custom bearer token.
This requires us to obtain a custom bearer token first. For testing we can leverage the awesome oidc token test project [justtrustme](https://github.com/chainguard-dev/justtrustme) from chainguard to obtain a test token.

> please do not use the token from justtrustme in production

On both the agent and the server, a bearer token can be configured to handle authentication.

Server config flags:

```sh
      --bearer-token=STRING     Bearer token to authenticate with store.
      --bearer-token-file=STRING
                                File to read bearer token from to authenticate
                                with store.
```

Agent config flags:

```sh
      --remote-store-bearer-token=STRING
                                   Bearer token to authenticate with store.
      --remote-store-bearer-token-file=STRING
                                   File to read bearer token from to
                                   authenticate with store.
```

After you have the bearer tokens setup you can move on to the next step.

## Reverse Proxy

Due to the fact, that currently all ingress points are running on the same port (7070 by default), a reverse proxy needs to be configured with the right paths to ensure the UI is not exposed.

In this example I am using Traefik2 ingress controller.

```yaml
---
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: parca
  namespace: ingress
spec:
  routes:
  - kind: Rule
    match: Host(`parca.example.com`) && ( Path(`/parca.profilestore.v1alpha1.ProfileStoreService/WriteRaw`) || Path(`/parca.debuginfo.v1alpha1.DebuginfoService/ShouldInitiateUpload`) || Path(`/parca.debuginfo.v1alpha1.DebuginfoService/InitiateUpload`) || Path(`/parca.debuginfo.v1alpha1.DebuginfoService/Upload`) || Path(`/parca.debuginfo.v1alpha1.DebuginfoService/MarkUploadFinished`) )
    services:
    - kind: Service
      name: parca
      namespace: profiling
      scheme: h2c # force the backend service to grpc. Did not work with default value...
      port: 7070
  tls: {}
```

> I would urgently recommend to use a TLS secured endpoint, parca agent can also be configured to allow insecure target hosts.

## Parca Agent

At the end, configure the Parca Agent to send data to the Reverse Proxy:

```sh
      containers:
      - args:
        - /bin/parca-agent
        - --http-address=:7071
        - --log-level=info
        - --node=$(NODE_NAME)
        - --remote-store-address=parca.example.com:443
        - --remote-store-bearer-token=<YOUR_TOKEN>
        #- --remote-store-insecure
        #- --remote-store-insecure-skip-verify
        - --debuginfo-strip
        - --debuginfo-temp-dir=/tmp
        - --debuginfo-upload-cache-duration=5m
```

After you have applied the agent config, profiling data should be transferred quickly.
