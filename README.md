# CM Kerala – Chief Minister's Public Grievance Redressal Portal

## Project Overview

The CM Kerala Grievance Portal is a web-based application that helps citizens submit grievances and track their resolution. It provides separate dashboards for CMO administrators and department officers.

The application integrates Google Gemini AI to analyze grievance descriptions and suggest complaint categories, departments, priorities and summaries.

## Key Features

- Citizen grievance submission
- Unique grievance reference number generation
- Grievance status tracking
- Gemini AI-powered grievance analysis
- AI-based category and department suggestions
- Priority identification
- Possible duplicate grievance detection
- CMO administrator dashboard
- Department officer assignment
- Officer investigation remarks
- Grievance status updates
- Citizen grievance tracking

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, Vite, HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | SQLite |
| AI Integration | Google Gemini API |
| Authentication | JWT, bcrypt |
| API | REST API |

## Project Structure

```text
CM_Kerala_Grievance_Portal/
│
├── backend/
│   ├── routes/
│   │   ├── ai.js
│   │   ├── auth.js
│   │   └── grievances.js
│   ├── db.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
│
├── README.md
└── .gitignore
```

## Grievance Workflow

1. Citizen submits a grievance.
2. Gemini AI analyzes the grievance.
3. The system generates a unique reference number.
4. CMO administrator reviews the complaint.
5. CMO assigns the grievance to a department officer.
6. Department officer investigates and updates the status.
7. Citizen tracks the grievance using the reference number.

## Installation and Setup

### Prerequisites

- Node.js
- npm
- Google Gemini API key

### Backend Setup

Open a terminal:

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5001
JWT_SECRET=your_private_secret
GEMINI_API_KEY=your_gemini_api_key
```

Use the exact Gemini environment variable name configured in `backend/routes/ai.js`.

Start the backend server:

```bash
node server.js
```

### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in the terminal.

## AI Integration

Google Gemini AI is integrated to analyze grievance titles and descriptions.

The AI provides:

- Suggested complaint category
- Suggested government department
- Complaint priority
- Summary for CMO review
- Possible duplicate flag
- Explanation for duplicate detection

AI recommendations support administrative decision-making and require human review.

## Testing

The following functionalities were tested:

- AI grievance analysis
- Grievance submission
- Reference number generation
- Citizen grievance tracking
- CMO administrator login
- Department officer login
- Officer assignment
- Officer status update
- Final grievance resolution

## Security

- Passwords are hashed using bcrypt.
- JWT is used for authentication.
- API keys and secret values are stored in environment variables.
- `.env` files must not be uploaded to GitHub.
- Demo credentials should be changed before deployment.

## Future Enhancements

- Grievance document and image uploads
- Email and SMS notifications
- Citizen feedback and satisfaction ratings
- Advanced analytics dashboard
- Improved duplicate grievance detection

## Author

**Avani**

## Project Purpose

Developed as an AI-powered public grievance management portal prototype for educational and demonstration purposes.