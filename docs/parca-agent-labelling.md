# Labels

This page provides a comprehensive reference for all labels supported by the Parca Agent, categorized for easy navigation. The labels include essential system, process, thread, Kubernetes, container, and agent metadata attached to profiling data. 
These labels can be used as-is or customized through [Prometheus relabeling](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#relabel_config) to enhance profiling insights and debugging efficiency.
The relabeling config can be passed to the agent via the `--config-path` flag. 

### **Always present labels**
| **Label** | **Description** |
|-----------|-----------------|
| **node**  | The name of the node that the process is running on as specified by the `--node` flag. |
| **comm**  | The command name of the process being profiled. |

---

### **Process-Related Labels (`__meta_process_*`)**
| **Label**                                  | **Description** |
|--------------------------------------------|-----------------|
| **__meta_process_pid**                     | The process ID of the process being profiled. |
| **__meta_process_cmdline**                 | The command line arguments of the process being profiled. |
| **__meta_process_cgroup**                  | The (main) cgroup of the process being profiled. |
| **__meta_process_ppid**                    | The parent process ID of the process being profiled. |
| **__meta_process_executable_file_id**      | The file ID (a hash) of the executable of the process being profiled. |
| **__meta_process_executable_name**         | The basename of the executable of the process being profiled. |
| **__meta_process_executable_build_id**     | The build ID of the executable of the process being profiled. |
| **__meta_process_executable_compiler**     | The compiler used to build the executable of the process being profiled. |
| **__meta_process_executable_static**       | Whether the executable of the process being profiled is statically linked. |
| **__meta_process_executable_stripped**     | Whether the executable of the process being profiled is stripped from debug information. |

---

### **System-Related Labels (`__meta_system_*`)**
| **Label**                      | **Description** |
|--------------------------------|-----------------|
| **__meta_system_kernel_release** | The kernel release of the system. |
| **__meta_system_kernel_machine** | The kernel machine of the system (typically the architecture). |

---

### **Thread-Related Labels (`__meta_thread_*`)**
| **Label**             | **Description** |
|-----------------------|-----------------|
| **__meta_thread_comm** | The command name of the thread being profiled. |
| **__meta_thread_id**   | The PID of the thread being profiled. |

---

### **Agent-Related Labels (`__meta_agent_*`)**
| **Label**                | **Description** |
|--------------------------|-----------------|
| **__meta_agent_revision** | The revision of the agent. |

---

### **Kubernetes-Related Labels (`__meta_kubernetes_*`)**
| **Label**                                   | **Description** |
|---------------------------------------------|-----------------|
| **__meta_kubernetes_namespace**            | The namespace of the pod the process is running in. |
| **__meta_kubernetes_pod_name**             | The name of the pod the process is running in. |
| **__meta_kubernetes_pod_label_***          | The value of the label * of the pod the process is running in. |
| **__meta_kubernetes_pod_labelpresent_***   | Whether the label * of the pod the process is running in is present. |
| **__meta_kubernetes_pod_annotation_***     | The value of the annotation * of the pod the process is running in. |
| **__meta_kubernetes_pod_annotationpresent_***| Whether the annotation * of the pod the process is running in is present. |
| **__meta_kubernetes_pod_ip**               | The IP of the pod the process is running in. |
| **__meta_kubernetes_pod_container_name**   | The name of the container the process is running in. |
| **__meta_kubernetes_pod_container_id**     | The ID of the container the process is running in. |
| **__meta_kubernetes_pod_container_image**  | The image of the container the process is running in. |
| **__meta_kubernetes_pod_container_init**   | Whether the container the process is running in is an init container. |
| **__meta_kubernetes_pod_ready**            | Whether the pod the process is running in is ready. |
| **__meta_kubernetes_pod_phase**            | The phase of the pod the process is running in. |
| **__meta_kubernetes_node_name**            | The name of the node the process is running on. |
| **__meta_kubernetes_pod_host_ip**          | The host IP of the pod the process is running in. |
| **__meta_kubernetes_pod_uid**              | The UID of the pod the process is running in. |
| **__meta_kubernetes_pod_controller_kind**  | The kind of the controller of the pod the process is running in. |
| **__meta_kubernetes_pod_controller_name**  | The name of the controller of the pod the process is running in. |
| **__meta_kubernetes_node_label_***         | The value of the label * of the node the process is running on. |
| **__meta_kubernetes_node_labelpresent_***  | Whether the label * of the node the process is running on is present. |
| **__meta_kubernetes_node_annotation_***    | The value of the annotation * of the node the process is running on. |
| **__meta_kubernetes_node_annotationpresent_***| Whether the annotation * of the node the process is running on is present. |

---

### **Container-Related Labels**
| **Prefix**                       | **Label**                    | **Description** |
|----------------------------------|-----------------------------|-----------------|
| **Docker (`__meta_docker_*`)**   | **__meta_docker_container_id** | The ID of the container the process is running in. |
|                                  | **__meta_docker_container_name** | The name of the container the process is running in. |
|                                  | **__meta_docker_build_kit_container_id** | The ID of the container the process is running in. |
| **Containerd (`__meta_containerd_*`)** | **__meta_containerd_container_id** | The ID of the container the process is running in. |
|                                  | **__meta_containerd_container_name** | The name of the container the process is running in. |
|                                  | **__meta_containerd_pod_name** | The name of the pod the process is running in. |
| **LXC (`__meta_lxc_*`)**         | **__meta_lxc_container_id**  | The ID of the container the process is running in. |

---

### **CPU-Related Labels**
| **Label**         | **Description** |
|-------------------|-----------------|
| **__meta_cpu**  | The CPU the sample was taken on. |


## Configuration

Parca Agent supports relabeling in the same fashion as Prometheus.
This can be used to add, update, or delete labels, as well as filtering the profiles sent to Parca (keep or drop).

To do so, pass a YAML configuration file to the agent with `--config-path` (default: `parca-agent.yaml`) with a list of `relabel_configs`.
Example:

```yaml
relabel_configs:
# Example: Add a profiler_pid label (e.g. provider_pid="cpu/1234")
- source_labels: [__name__, pid]
  separator: /
  target_label: profiler_pid
  regex: parca_agent_(.+)
  replacement: $1
  action: replace
```

Please see the [Prometheus `relabel_config` documentation](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#relabel_config) for more details about the fields.
