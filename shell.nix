{ pkgs ? import <nixpkgs> { } }:
let
  easy-ps = import (pkgs.fetchFromGitHub {
    owner = "justinwoo";
    repo = "easy-purescript-nix";
    rev = "3b4039475c245243716b1e922455a9062c0531da";
    sha256 = "0fk2r02z86rirg5kggd0vvcgp8h07w7fhp03xng7wjrifljxwann";
  }) { inherit pkgs; };
in with pkgs;

mkShell { buildInputs = [ docker-compose easy-ps.purs-0_14_0 spago ]; }
