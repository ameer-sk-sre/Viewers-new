# System Architecture

This document describes the architectural layout of the customized OHIF + Orthanc system. The deployment is fully containerized and orchestrated via Docker Compose, leveraging several microservices to deliver a secure, performant DICOM viewing experience.

## Component Overview

The system is composed of the following core Docker containers:

1. **OHIF Viewer & Nginx (`ohif_viewer`)**
   - **Role**: The main entry point. It serves the statically built OHIF Viewer assets and acts as a reverse proxy for backend services.
   - **Network Function**: Listens on ports 80 (HTTP, redirects to HTTPS) and 443 (HTTPS).
   - **Capabilities**: Generates self-signed certificates on startup if Let's Encrypt certs are not yet available.
   - **Routing Rules**:
     - `/`: Serves the OHIF Viewer React app (Protected via OAuth2 proxy).
     - `/pacs/`: Proxies DICOMWeb API requests to Orthanc (Protected via OAuth2 proxy).
     - `/pacs-admin/`: Proxies Orthanc administrative UI (Protected via OAuth2 proxy, restricted to `pacsadmin` group).
     - `/oauth2/`: Routes to the OAuth2 proxy for authentication callbacks and sign-ins.
     - `/keycloak/`: Routes to the external Keycloak instance.

2. **Orthanc Server (`orthanc`)**
   - **Role**: The core DICOM server/PACS. 
   - **Network Function**: Exposes DICOM port `4242` and internal HTTP port `8042` (accessible externally only via Nginx proxy).
   - **Capabilities**: Parses, stores, and indexes DICOM imagery. Interacts with the MySQL database for metadata indexing instead of the default SQLite.
   - **Storage**: Maps physical storage to a persistent external volume (e.g., EFS `/mnt/efs/orthanc-storage`).

3. **MySQL Database (`mysql`)**
   - **Role**: Relational database for Orthanc metadata index.
   - **Image**: `mysql:8.0.36`.
   - **Network Function**: Communicates directly with the `orthanc` container on port 3306.

4. **OAuth2-Proxy (`oauth2-proxy`)**
   - **Role**: Middleware that intercepts unauthenticated requests from Nginx and redirects them to the Keycloak Identity Provider (OIDC).
   - **Network Function**: Listens on port `4180` and proxies authenticated requests upstream.
   - **Capabilities**: Validates JWT tokens, enforces domain whitelists (`.medicoveronline.com`, `.hrspace.in`), and injects session headers.

5. **Redis (`redis`)**
   - **Role**: Session storage cache for OAuth2-Proxy to maintain user login states rapidly without relying solely on encrypted cookies.

6. **Certbot (`certbot`)**
   - **Role**: Automates Let's Encrypt SSL certificate issuance and renewal via HTTP-01 challenges on port 80.
   - **Network Function**: Periodically wakes up to run `certbot renew`.

## Security Flow (Authentication)

1. A user attempts to access `https://pacs.medicoveronline.com/`.
2. Nginx intercepts the request and issues an `auth_request` to the OAuth2 Proxy.
3. If unauthenticated, the user is redirected to Keycloak (`https://keyc.hrspace.in/`).
4. Upon successful login, Keycloak redirects back to `https://pacs.medicoveronline.com/oauth2/callback`.
5. OAuth2-Proxy validates the token, stores the session in Redis, and sets a secure cookie.
6. Nginx injects `X-User`, `X-Access-Token`, and `Set-Cookie` headers into the downstream request, allowing OHIF to load.
7. Subsequent XHR/Fetch requests from OHIF to `/pacs/` (Orthanc) include the secure cookie via `withCredentials: true`, maintaining the authenticated state.

## Configuration & Linking

- **OHIF Datasource mapping**: The `radiomind_orthanc.js` file sets the primary data source to `orthancProxy`, pointing `qidoRoot` and `wadoRoot` to `/pacs`.
- **Orthanc Host Mapping**: Orthanc is explicitly instructed to expect `pacs.medicoveronline.com` as the Host for DICOMWeb operations, ensuring accurate absolute URLs in generated metadata responses.
