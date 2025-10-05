{
  description = "Dev shell for nft-minting-metaplex-nextjs-tailwind-template using k3d";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs_20
            pkgs.nodePackages.pnpm
            pkgs.git
            pkgs.docker
            pkgs.k3d
            pkgs.kubectl
          ];

          shellHook = ''
            export NODE_ENV=development

            # Create k3d cluster if it doesn't exist
            if ! k3d cluster list | grep -q nft-minting; then
              echo "Creating k3d cluster 'nft-minting'..."
              k3d cluster create nft-minting \
                --port "4000:4000@loadbalancer" \
                --port "9090:9090@loadbalancer" \
                --port "3100:3100@loadbalancer" \
                --port "3200:3200@loadbalancer" \
                --port "4318:4318@loadbalancer"
            fi

            export KUBECONFIG=$(k3d kubeconfig get nft-minting)

            echo "Deploying observability stack..."
            kubectl apply -f ./k8s/grafana.yaml
            kubectl apply -f ./k8s/prometheus.yaml
            kubectl apply -f ./k8s/loki.yaml
            kubectl apply -f ./k8s/tempo.yaml
            kubectl apply -f ./k8s/otel-collector.yaml

            echo "✅ k3d observability stack running"
            echo "Grafana:     http://localhost:4000 (admin/admin)"
            echo "Prometheus:  http://localhost:9090"
            echo "Loki:        http://localhost:3100"
            echo "Tempo:       http://localhost:3200"
            echo "OTel:        http://localhost:4318"
          '';
        };

        apps.dev = {
          type = "app";
          program = "${pkgs.writeShellScriptBin "pnpm-dev" ''
            #!/usr/bin/env bash
            pnpm install --frozen-lockfile
            pnpm run dev
          ''}/bin/pnpm-dev";
        };
      });
}
