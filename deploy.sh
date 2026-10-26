#!/usr/bin/env bash
# Run from repo root: chmod +x deploy.sh && ./deploy.sh
exec "$(dirname "$0")/scripts/deploy-production.sh" "$@"
