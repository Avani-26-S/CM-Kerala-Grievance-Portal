# 04 – API Documentation

## 1. Introduction

The CM Kerala Grievance Portal uses REST APIs developed with Node.js and Express.js.

The APIs handle authentication, grievance submission, tracking, officer assignment, status updates and AI analysis.

Base URL during local development:

`http://localhost:5001`

## 2. Authentication APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/auth/register | Register a citizen |
| POST | /api/auth/login | Authenticate a user |

## 3. Grievance APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/grievances | Submit a grievance |
| GET | /api/grievances/track/:referenceNumber | Track a grievance |
| GET | /api/grievances/admin/all | Retrieve all grievances |
| PATCH | /api/grievances/admin/:referenceNumber/status | Update grievance status |
| PATCH | /api/grievances/admin/:referenceNumber/assign | Assign an officer |
| GET | /api/grievances/admin/officers | Retrieve department officers |
| GET | /api/grievances/officer/assigned | Retrieve assigned grievances |
| PATCH | /api/grievances/officer/:referenceNumber/status | Update assigned grievance status |

## 4.