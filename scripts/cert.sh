#!/usr/bin/env bash
set -euo pipefail
echo "mkcert localhost"
cd packages/apps && mkcert localhost || exit 1