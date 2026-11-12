# 01 – Project Overview

## 1. Project Title

CM Kerala – Chief Minister's Public Grievance Redressal Portal

## 2. Introduction

The CM Kerala Grievance Portal is a web-based application designed to simplify the process of submitting, managing and tracking public grievances.

The system provides a centralized platform where citizens can submit complaints, CMO administrators can review and assign grievances, and department officers can investigate and update complaint statuses.

The application integrates Google Gemini AI to analyze grievance descriptions and provide suggestions for category, department, priority and complaint summary.

## 3. Project Objectives

- Provide an easy-to-use grievance submission platform.
- Generate unique reference numbers for submitted complaints.
- Allow citizens to track grievance status.
- Provide separate dashboards for CMO administrators and department officers.
- Support grievance assignment and status management.
- Use AI to assist in grievance classification and analysis.
- Improve transparency in grievance handling.

## 4. Main Modules

### Citizen Module
- Citizen login
- Grievance submission
- AI-assisted complaint analysis
- Reference number generation
- Grievance tracking

### CMO Administrator Module
- View submitted grievances
- Review complaints
- Update grievance status
- Assign grievances to department officers
- Monitor complaint progress

### Department Officer Module
- View assigned grievances
- Investigate complaints
- Add investigation remarks
- Update grievance status

### AI Module
- Analyze grievance title and description
- Suggest complaint category
- Suggest responsible department
- Recommend priority
- Generate complaint summary
- Identify possible duplicates

## 5. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React and Vite |
| Backend | Node.js and Express.js |
| Database | SQLite |
| AI | Google Gemini API |
| Authentication | JWT and bcrypt |
| API | REST API |

## 6. Grievance Status Workflow

1. Submitted
2. Under Review
3. In Progress
4. Resolved
5. Reopened

## 7. Expected Outcome

The project demonstrates an AI-assisted grievance management workflow that supports citizens, administrators and department officers in managing public complaints.

## 8. Project Author

Avani