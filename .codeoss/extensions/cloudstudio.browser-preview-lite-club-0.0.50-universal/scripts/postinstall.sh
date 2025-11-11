#!/usr/bin/env bash
set -euxo pipefail

system_info="$(uname -a)"
if [[ $system_info == "Linux"* && $system_info == *"x86_64"* ]]; then
  wget -qO bin/ss https://devops-generic.pkg.codingcorp.woa.com/cloud-studio-next/public/ss?version=v5.19.0-amd64
elif [[ $system_info == "Linux"* && $system_info == *"aarch64"* ]]; then
  wget -qO bin/ss https://devops-generic.pkg.codingcorp.woa.com/cloud-studio-next/public/ss?version=v5.19.0-arm64
fi
