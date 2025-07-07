#!/bin/bash

# This script cleans everything

set -e  # Exit on any error

echo "📦 Removing all node_modules folders..."
find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true

echo "🗂️  Removing all dist folders..."
find . -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true

echo "🔒 Removing all package-lock.json files..."
find . -name "package-lock.json" -type f -delete 2>/dev/null || true

echo "🔒 Removing all .turbo files..."
find . -name ".turbo" -type d -exec rm -rf {} + 2>/dev/null || true

rm -rf packages/studio/boxes/src/* 2>/dev/null || true
