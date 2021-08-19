# Kubernetes

To quickly try out the Parca Agent with Kubernetes, create a [minikube](https://minikube.sigs.k8s.io/docs/) cluster with an actual virtual machine, eg. virtualbox:

```
minikube start --driver=virtualbox
```

Then provision the parca-agent:

```
kubectl create -f deploy/manifests
```

<details>
  <summary><code>Example manifests.yaml</code></summary>
  <p>

  ```yaml
  apiVersion: v1
  kind: Namespace
  metadata:
    name: parca
  ---
  apiVersion: v1
  kind: ServiceAccount
  metadata:
    name: parca-agent
    namespace: parca
  ---
  kind: ClusterRoleBinding
  apiVersion: rbac.authorization.k8s.io/v1
  metadata:
    name: parca-agent
  subjects:
  - kind: ServiceAccount
    name: parca-agent
    namespace: parca
  roleRef:
    kind: ClusterRole
    name: cluster-admin
    apiGroup: rbac.authorization.k8s.io
  ---
  apiVersion: apps/v1
  kind: DaemonSet
  metadata:
    name: parca-agent
    namespace: parca
    labels:
      app.kubernetes.io/name: parca-agent
  spec:
    selector:
      matchLabels:
        app.kubernetes.io/name: parca-agent
    template:
      metadata:
        labels:
          app.kubernetes.io/name: parca-agent
      spec:
        serviceAccount: parca-agent
        hostPID: true
        containers:
        - name: parca-agent
          image: quay.io/parca/parca-agent@sha256:265fb65d029d136644304737c739786c2b1695034dd66c743dc59ef6324c3311
          imagePullPolicy: Always
          args:
          - /bin/parca-agent
          - --node=$(NODE_NAME)
            #- --sampling-ratio=0.5
            #- --pod-label-selector=app=my-web-app
          env:
            - name: NODE_NAME
              valueFrom:
                fieldRef:
                  fieldPath: spec.nodeName
          securityContext:
            privileged: true
          volumeMounts:
          - name: root
            mountPath: /host/root
            readOnly: true
          - name: proc
            mountPath: /host/proc
            readOnly: true
          - name: run
            mountPath: /run
          - name: modules
            mountPath: /lib/modules
          - name: debugfs
            mountPath: /sys/kernel/debug
          - name: cgroup
            mountPath: /sys/fs/cgroup
          - name: bpffs
            mountPath: /sys/fs/bpf
          - name: localtime
            mountPath: /etc/localtime
        tolerations:
        - effect: NoSchedule
          operator: Exists
        - effect: NoExecute
          operator: Exists
        volumes:
        - name: root
          hostPath:
            path: /
        - name: proc
          hostPath:
            path: /proc
        - name: run
          hostPath:
            path: /run
        - name: cgroup
          hostPath:
            path: /sys/fs/cgroup
        - name: modules
          hostPath:
            path: /lib/modules
        - name: bpffs
          hostPath:
            path: /sys/fs/bpf
        - name: debugfs
          hostPath:
            path: /sys/kernel/debug
        - name: localtime
          hostPath:
            path: /etc/localtime
  ```

  </p>
</details>

To view the active profilers port-forward and visit `http://localhost:7071`:

```
kubectl -n parca port-forward `kubectl -n parca get pod -lapp.kubernetes.io/name=parca-agent -ojsonpath="{.items[0].metadata.name}"` 7071
```

To continuously send every profile collected to a Parca server the configure the `--store-address` and the potential credentials needed. For example, to send to a Parca server in the `parca` namespace set: `--store-address=parca.parca.svc:7070`.

## Kubernetes label selector

To further sample targets on Kubernetes use the `--pod-label-selector=` flag. For example to only profile Pods with the `app.kubernetes.io/name=my-web-app` label, use `--pod-label-selector=app.kubernetes.io/name=my-web-app`.
