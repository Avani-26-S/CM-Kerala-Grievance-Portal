# 05 – AI Integration

## 1. Overview

The CM Kerala Grievance Portal integrates Google Gemini AI to assist with grievance analysis and classification.

The AI analyzes a citizen's complaint and provides recommendations to support the grievance review process.

## 2. Technology Used

- Google Gemini API
- Google GenAI JavaScript SDK (`@google/genai`)
- Node.js and Express.js

## 3. AI Features

The AI generates the following information:

- **Category:** Suggested grievance category
- **Department:** Suggested responsible government department
- **Priority:** Low, Medium, High or Critical
- **Summary:** Short complaint summary for CMO review
- **Duplicate Flag:** Indicates a possible duplicate
- **Duplicate Reason:** Explains the duplicate indication

## 4. AI Processing Workflow

1. Citizen enters a grievance title and description.
2. Citizen clicks **Analyze with AI**.
3. React sends the complaint to the backend API.
4. The backend sends the complaint to Gemini.
5. Gemini generates a structured JSON response.
6. The backend returns the analysis to React.
7. The frontend displays the recommendations.

## 5. AI API Endpoint

**Method:** POST

**Endpoint:** `/api/ai/analyze`

Example request:

```json
{
  "title": "Delay in drinking water supply",
  "description": "Residents have not received drinking water for five days."
}
```

Example response structure:

```json
{
  "success": true,
  "analysis": {
    "category": "Drinking Water Supply",
    "department": "Kerala Water Authority",
    "priority": "High",
    "summary": "Residents report a prolonged drinking water supply interruption.",
    "duplicate_flag": false,
    "duplicate_reason": "No clear duplicate indication in the submitted text."
  }
}
```

## 6. Security

The Gemini API key is stored in `backend/.env` and is not exposed to the frontend.

## 7. Limitations

- AI suggestions may be inaccurate and require human review.
- The duplicate flag is based on complaint text and does not confirm a database duplicate.
- API requests may fail due to network issues, rate limits or service availability.

## 8. Conclusion

Gemini AI improves the grievance submission experience by providing structured analysis and recommendations while leaving final decisions to authorized personnel.