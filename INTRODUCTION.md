# Project Introduction

Welcome to the **Custom OHIF + Orthanc + Keycloak** deployment repository. This project is a tailored customization of the standard OHIF `Nginx-Orthanc` recipe, designed for secure, production-grade medical imaging deployment.

## Overview

The core objective of this project is to provide a robust, cloud-ready PACS (Picture Archiving and Communication System) and DICOM Viewer. It achieves this by extending the OHIF viewer and Orthanc DICOM server with modern authentication, robust database storage, and automated SSL certificate management.

### Key Customizations & Enhancements

This project significantly alters the baseline `Nginx-Orthanc` setup by introducing the following changes:

1. **Enterprise Authentication (OIDC)**: 
   - Replaced basic authentication with an **OAuth2-Proxy** integration using Redis for session management.
   - Integrated a dedicated Keycloak Identity Provider (at `keyc.hrspace.in`) via OpenID Connect (OIDC).
   - Added role-based access control for administrative interfaces (`/pacs-admin/`).

2. **Relational Database Backend**:
   - Migrated the Orthanc storage backend from the default SQLite to a highly scalable **MySQL 8** database.
   - Externalized DICOM storage to mounted volumes (e.g., EFS mounts `/mnt/efs/orthanc-storage`).

3. **Secure Routing & SSL Management**:
   - Centralized all traffic through a customized **Nginx** reverse proxy handling both OHIF and Orthanc API traffic.
   - Integrated **Certbot** for automated Let's Encrypt SSL certificate provisioning and renewal.
   - Implemented automatic self-signed certificate generation as a fallback mechanism for localized environments.

4. **Build Optimization**:
   - Updated the Dockerfile to use a modern `node:20.19.0-slim` image.
   - Introduced `bun` for enhanced tooling capabilities alongside Yarn workspaces.

## Structure

The custom recipe configuration is housed in `platform/app/.recipes/Nginx-Orthanc/`, which includes:
- `docker-compose.yml`: Defines the orchestration of the Viewer, Orthanc, MySQL, OAuth2 Proxy, Redis, and Certbot.
- `dockerfile`: Custom multi-stage build instructions for the OHIF Viewer.
- `config/nginx.conf`: Advanced proxy rules routing API requests, authenticating users, and managing SSL.
- `config/orthanc.json`: Orthanc DICOM server configuration optimized for the custom Nginx proxy and MySQL DB.

## Additional Documentation

To fully understand and operate this project, please refer to the following supporting documents:
- [**ARCHITECTURE.md**](./ARCHITECTURE.md): Detailed explanation of the component interactions, data flow, and network architecture.
- [**DEPLOYMENT.md**](./DEPLOYMENT.md): Step-by-step instructions for configuring environment variables, setting up external volumes, and running the Docker Compose stack.
