#!/usr/bin/env bash
set -euo pipefail
echo "mkcert localhost"
cd apps && mkcert localhost || exit 1