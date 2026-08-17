# Deployment Guide

This document outlines the steps required to deploy the custom OHIF + Orthanc infrastructure. 

## Prerequisites

Before deploying, ensure your host environment has:
- **Docker** and **Docker Compose** installed.
- Open ports for **80 (HTTP)**, **443 (HTTPS)**, and optionally **4242 (DICOM)** on your firewall.
- Domain `pacs.medicoveronline.com` pointing to the host machine's IP address.

## External Volumes

The deployment requires external named volumes to persist state across container restarts and updates. 

Create the following Docker volumes before starting:

```bash
docker volume create distand_orthanc-storage
docker volume create dicom_mysql-data-new
```
*(Alternatively, if your host uses a mount like `/mnt/efs/orthanc-storage`, ensure the path exists and the Docker daemon has read/write permissions for it.)*

## Environment Variables

You must define the following environment variables. It is highly recommended to provide these via a `.env` file located in `platform/app/.recipes/Nginx-Orthanc/`.

```env
# Database
MYSQL_PASSWORD=your_secure_mysql_password

# OAuth2 Proxy Secrets
OAUTH2_PROXY_CLIENT_SECRET=your_keycloak_client_secret
OAUTH2_PROXY_COOKIE_SECRET=your_generated_cookie_secret_base64
```
*Note: The `OAUTH2_PROXY_COOKIE_SECRET` must be a 16, 24, or 32-byte base64 encoded string.*

## Launching the Stack

1. Navigate to the recipe directory:
   ```bash
   cd platform/app/.recipes/Nginx-Orthanc/
   ```

2. Build the OHIF Viewer image. This utilizes the custom Node 20 / Bun Dockerfile:
   ```bash
   docker-compose build
   ```

3. Bring up the entire stack in detached mode:
   ```bash
   docker-compose up -d
   ```

## SSL & Certificates

- **Initial Startup**: The `ohif_viewer` container script checks `/etc/letsencrypt/live/pacs.medicoveronline.com/`. If no certificates are present, it auto-generates a self-signed fallback certificate to ensure Nginx can start successfully.
- **Let's Encrypt**: The `certbot` container continuously runs in the background. To manually trigger a Let's Encrypt generation after starting the stack, you can attach to the certbot container or restart it if the HTTP challenge is ready.
- **Paths**: SSL files are mounted from `./config/letsencrypt` and `./config/certbot` on the host to the respective containers.

## Verification

- **Viewer Access**: Navigate to `https://pacs.medicoveronline.com/`. You should be redirected to the Medicover Keycloak login page.
- **Orthanc Admin**: Navigate to `https://pacs.medicoveronline.com/pacs-admin/`. This requires your Keycloak user to possess the `pacsadmin` group/role.
- **DICOM Storage**: Send DICOM files to port `4242` or use the Orthanc Web Interface to verify images are properly ingested and routed into MySQL.
