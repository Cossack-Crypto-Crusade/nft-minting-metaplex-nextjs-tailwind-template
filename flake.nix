{
  description = "Dev shell for nft-minting-metaplex-nextjs-tailwind-template";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = import nixpkgs { inherit system; };
      in {
        devShell = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs_20
            pkgs.nodePackages.pnpm
            pkgs.git
          ];

          shellHook = ''
            export NODE_ENV=development
            if [ ! -d node_modules ]; then
              echo "Installing dependencies with pnpm..."
              pnpm install
            fi
          '';
        };
      });
}
