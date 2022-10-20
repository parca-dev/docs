# Parca Datasource plugin for Grafana
The Parca Datasource plugin for Grafana allows you to connect to a Parca server and query for profiles from the Grafana dashboard.

## Usage
1. Install the Parca datasource plugin by following the instructions in this [article](https://www.polarsignals.com/blog/posts/2022/10/20/parca-plugin-for-grafana/#:~:text=once%20it%27s%20ready!-,Manual%20Installation,-You%20can%20install). <!-- from the [Grafana plugin repository](https://grafana.com/grafana/plugins/parca-datasource/). -->
2. In the Grafana UI, navigate to the `Configuration` -> `Data Sources` page.
3. Click on the `Add data source` button.
4. Select the `Parca` datasource.
5. Enter the API URL of the Parca server in the `API Endpoint` field. For example, `http://localhost:7070/api`.
   Note: Please make sure cors configuration of the Parca server allow requests from your Grafana Dashboard origin. If you Grafana dashboard is running at `http://localhost:3000`, then ensure that the Parca server is started with either `--cors-allowed-origins='http://localhost:3000'` or `--cors-allowed-origins='*'` flag. Please refer the [docs](https://www.parca.dev/docs/grafana-datasource-plugin#allow-cors-requests).
6. Click on the `Save & Test` button. If the connection is successful, you should see a green `Data source is working` message.
7. Now you can use the Parca datasource in your panels.

## Screenshot

![Parca Datasource Plugin](https://raw.githubusercontent.com/parca-dev/parca/main/ui/packages/app/grafana-datasource-plugin/src/img/screenshots/datasource-config.png)


## Allow Cors Requests
The Parca server by default only allows requests from the same origin. To allow requests from other origins, you can set the `--cors-allowed-origins` flag to a comma separated list of origins. For example, to allow requests from `http://localhost:3000`, you can run the Parca server with the following flag:

`--cors-allowed-origins='http://localhost:3000'` or `--cors-allowed-origins='*'`(to allow requests from all origins).
