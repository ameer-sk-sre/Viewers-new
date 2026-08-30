# Local Deployment Project (RadioMind OHIF + Orthanc PACS)

This directory contains a complete, zero-cloud, standalone local deployment setup for running **OHIF Viewer v3** connected to a local **Orthanc DICOM PACS Server**.

---

## 🚀 Quick Start (1-Click Run)

To build and start the entire local deployment stack:

```bash
./local-deployment/run-local.sh
```

Or using Docker Compose directly:

```bash
docker compose -f local-deployment/docker-compose.yml up --build -d
```

---

## 🌐 Access Endpoints

Once running, access the services at:

- **OHIF Medical Imaging Viewer**: [http://localhost](http://localhost)
- **Orthanc PACS Explorer**: [http://localhost/pacs](http://localhost/pacs)
- **Orthanc DICOM C-STORE Port**: `localhost:4242`

---

## 📥 Uploading DICOM Images

### Option A: Using Orthanc Web Interface
1. Navigate to [http://localhost/pacs](http://localhost/pacs)
2. Click **Upload** in the top-right corner.
3. Drag & drop `.dcm` files or folders containing DICOM images.
4. Refresh [http://localhost](http://localhost) to view the uploaded studies.

### Option B: Using Stores/Upload in OHIF Viewer
1. Navigate to [http://localhost](http://localhost)
2. Drag & drop DICOM files directly into the OHIF viewer interface.

---

## 📋 Useful Commands

### View Logs
```bash
docker compose -f local-deployment/docker-compose.yml logs -f
```

### Stop Deployment
```bash
docker compose -f local-deployment/docker-compose.yml down
```

### Rebuild Viewer After Changes
```bash
docker compose -f local-deployment/docker-compose.yml up --build -d ohif
```

---

## 📁 Directory Architecture

- **`docker-compose.yml`**: Configures OHIF and Orthanc containers.
- **`Dockerfile`**: Multi-stage build for compiling OHIF Viewer static assets into Nginx.
- **`nginx.conf`**: Reverse proxy configuration routing `/pacs/` and `/dicom-web/` to Orthanc and `/` to OHIF.
- **`orthanc.json`**: Orthanc PACS server configuration with DICOMweb enabled.
- **`config.js`**: Custom OHIF configuration pointing default data source to local Orthanc.
