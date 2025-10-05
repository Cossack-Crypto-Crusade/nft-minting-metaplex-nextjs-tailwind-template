#!/usr/bin/env bash
mkdir -p ./grafana-data ./grafana-data/plugins ./grafana-data/provisioning
export GF_PATHS_DATA=$(pwd)/grafana-data
export GF_PATHS_PROVISIONING=$(pwd)/grafana-data/provisioning
export GF_SERVER_HTTP_PORT=4000
export GF_SERVER_HTTP_ADDR=0.0.0.0
${pkgs.grafana}/bin/grafana
