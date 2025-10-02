# AgriSentinel Frontend MVP - Todo List

## Project Overview
AgriSentinel is an agricultural monitoring SaaS platform with multi-actor support (Farmers, Cooperatives, State/Funders, NGOs/Certification bodies).

## Core Files to Create/Modify

### 1. Configuration & Setup
- [ ] Update index.html title and meta tags for AgriSentinel
- [ ] Create lib/firebase.ts for Firebase configuration
- [ ] Create lib/geo.ts for GPS/polygon utilities (Sizer algorithm)
- [ ] Create lib/hash.ts for blockchain-like traceability
- [ ] Create lib/rules.ts for health status and yield prediction

### 2. Authentication & User Management
- [ ] Create pages/Auth.tsx - Login/Signup with role assignment
- [ ] Create guards/withRole.tsx - Role-based access control

### 3. Core Features
- [ ] Create pages/Dashboard.tsx - Role-specific dashboards
- [ ] Create pages/ParcellesList.tsx - List of parcels
- [ ] Create pages/ParcelleNew.tsx - Create parcel with GPS Sizer
- [ ] Create pages/ParcelleDetail.tsx - Parcel details with health/predictions
- [ ] Create components/MapDraw.tsx - Leaflet map with drawing capabilities
- [ ] Create components/Sizer.tsx - GPS point to polygon converter

### 4. Data Management
- [ ] Create pages/RecoltesForm.tsx - Monthly harvest recording
- [ ] Create pages/LotsList.tsx - Batch management
- [ ] Create pages/LotNew.tsx - Create new batch with QR code
- [ ] Create components/QRCode.tsx - QR code generation

### 5. Monitoring & Analytics
- [ ] Create pages/Detections.tsx - Mock plantation detection map
- [ ] Create pages/Admin.tsx - Simple admin panel for role management

## Key Features Implementation Priority
1. **GPS Sizer**: Point GPS → Auto-polygon (hexagon/square) with adjustable surface
2. **Health Status**: Green/Orange/Red based on rain days and harvest variation
3. **Yield Prediction**: Algorithm based on culture, age, health, and history
4. **Forbidden Zones**: Geofencing with protected areas intersection
5. **Traceability**: Hash-chain for batch tracking with QR codes
6. **Role-based Dashboards**: Different views for each user type

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS + Shadcn/ui components
- Leaflet for maps + leaflet-draw
- Turf.js for geospatial calculations
- Firebase (Auth + Firestore + Storage)
- Chart.js for analytics
- QR code generation/scanning

## User Roles & Permissions
- **Planteur** (Farmer): Create parcels, record harvests, manage batches
- **Coop** (Cooperative): View farmer data, scan QR codes, export reports
- **État** (State/Funders): Regional reports, forbidden zone monitoring
- **ONG/Cert** (NGO/Certification): Batch validation, audit trails