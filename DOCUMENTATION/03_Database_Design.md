# 03 – Database Design

## 1. Database Overview

The CM Kerala Grievance Portal uses SQLite as its database.

The database stores user accounts, grievance details, officer assignments and grievance status history.

## 2. Database Tables

### Users Table

Stores citizen, CMO administrator and department officer details.

| Column | Description |
|---|---|
| id | Unique user ID |
| name | User name |
| email | User email |
| password | Hashed password |
| role | Citizen, CMO or Officer |
| department | Officer department |
| created_at | Account creation timestamp |

### Grievances Table

Stores grievance information submitted by citizens.

| Column | Description |
|---|---|
| id | Unique grievance ID |
| reference_number | Unique grievance reference |
| citizen_id | Citizen user ID |
| title | Grievance title |
| description | Grievance description |
| category | Grievance category |
| department | Assigned department |
| priority | Grievance priority |
| status | Current grievance status |
| assigned_officer_id | Assigned officer ID |
| created_at | Submission timestamp |
| updated_at | Last update timestamp |

### Status History Table

Maintains grievance status changes.

| Column | Description |
|---|---|
| id | Unique history ID |
| grievance_id | Related grievance ID |
| status | Updated status |
| remark | Status update remarks |
| changed_by | User who changed the status |
| changed_at | Status change timestamp |

## 3. Table Relationships

- One user can submit multiple grievances.
- Each grievance belongs to one citizen.
- A grievance can be assigned to a department officer.
- One grievance can have multiple status history records.
- Each status history record is associated with a grievance.

## 4. Database Relationship Diagram

```text id="4j9w4s"
USERS
  |
  | 1
  |
  | Many
GRIEVANCES
  |
  | 1
  |
  | Many
STATUS_HISTORY

USERS (OFFICERS)
  |
  | 1
  |
  | Many
GRIEVANCES (ASSIGNED OFFICER)
```

## 5. Data Management

The backend uses SQLite queries to:
- Register and authenticate users.
- Insert new grievances.
- Retrieve grievances using reference numbers.
- Assign grievances to officers.
- Update grievance statuses.
- Maintain status history.

## 6. Conclusion

The database design supports the core grievance management workflow and maintains information about citizens, administrators, officers and grievance progress.