#!/usr/bin/env bash

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

echo "============================================================"
echo " Starting RadioMind Local OHIF & Orthanc PACS Deployment"
echo "============================================================"
echo "Root directory: $ROOT_DIR"
echo ""

cd "$ROOT_DIR"

echo "Building and starting Docker containers..."
docker compose -f local-deployment/docker-compose.yml up --build -d

echo ""
echo "============================================================"
echo " Deployment Successfully Started!"
echo "============================================================"
echo " - OHIF Viewer:   http://localhost"
echo " - Orthanc PACS:  http://localhost/pacs"
echo " - DICOM Port:    localhost:4242"
echo ""
echo "To view container logs:"
echo "  docker compose -f local-deployment/docker-compose.yml logs -f"
echo ""
echo "To stop containers:"
echo "  docker compose -f local-deployment/docker-compose.yml down"
echo "============================================================"
