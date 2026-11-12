# 06 – Setup and Testing

## 1. Prerequisites
- Node.js
- npm
- Visual Studio Code
- Google Gemini API key

## 2. Project Setup

Clone the GitHub repository:

```bash
git clone https://github.com/Avani-26-S/CM-Kerala-Grievance-Portal.git
cd CM-Kerala-Grievance-Portal
```

## 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5001
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend:

```bash
node server.js
```

The backend runs at `http://localhost:5001`.

## 4. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 5. Testing

The following functions were tested:

- Backend server startup.
- User login and authentication.
- Citizen grievance submission.
- Unique grievance reference number generation.
- AI-based grievance analysis using Gemini.
- Public grievance tracking.
- CMO dashboard grievance viewing.
- Department officer assignment.
- Officer dashboard grievance viewing.
- Grievance status update.
- Status visibility in citizen tracking.

## 6. Security Notes

- API keys and secrets are stored in the backend `.env` file.
- The `.env` file is excluded from GitHub using `.gitignore`.
- JWT authentication is used for protected API routes.
- Role-based access is applied to administrative and officer functions.

## 7. Conclusion

The application was tested through the main grievance workflow, from citizen submission to department action and final status tracking.