{
  description = "Dev shell for nft-minting-metaplex-nextjs-tailwind-template";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        devShell = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs_20
            pkgs.nodePackages.pnpm
            pkgs.git
            pkgs.aspell
          pkgs.pnpm
          pkgs.python3
          pkgs.pkg-config
          pkgs.systemd # for libudev
          pkgs.libusb1            
            pkgs.aspellDicts.en
          ];

          shellHook = ''
            export NODE_ENV=development
            pnpm install
            if [ ! -d node_modules ]; then
              echo "Installing dependencies with pnpm..."
 
            fi
          '';
        };

        # Apps section lets you do nix run .#dev
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