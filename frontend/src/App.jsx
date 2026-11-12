
import { useState } from "react";
import keralaLogo from "./assets/logo23_2.png";
import "./App.css";

function App() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
const [loginPassword, setLoginPassword] = useState("");
const [loggedInUser, setLoggedInUser] = useState(null);
const [adminGrievances, setAdminGrievances] = useState([]);
const [adminError, setAdminError] = useState("");
const [officers, setOfficers] = useState([]);
const [officerError, setOfficerError] = useState("");
const [officerGrievances, setOfficerGrievances] = useState([]);
const [aiAnalysis, setAiAnalysis] = useState(null);
const [aiLoading, setAiLoading] = useState(false);
const loadAdminGrievances = async () => {
  try {
    const token = localStorage.getItem("citizenToken");

    const response = await fetch(
      "http://localhost:5001/api/grievances/admin/all",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setAdminError(data.message || "Unable to load grievances.");
      return;
    }

    setAdminGrievances(data.grievances || []);
    setAdminError("");
  } catch (error) {
    setAdminError("Unable to connect to the backend.");
  }
};
const loadOfficers = async () => {
  try {
    const token = localStorage.getItem("citizenToken");

    const response = await fetch(
      "http://localhost:5001/api/grievances/admin/officers",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setOfficerError(data.message || "Unable to load officers.");
      return;
    }

    setOfficers(data.officers || []);
    setOfficerError("");
  } catch (error) {
    setOfficerError("Unable to connect to the backend.");
  }
};
const loadOfficerGrievances = async () => {
  try {
    const token = localStorage.getItem("citizenToken");

    const response = await fetch(
      "http://localhost:5001/api/grievances/officer/assigned",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setOfficerError(data.message || "Unable to load assigned grievances.");
      return;
    }

    setOfficerGrievances(data.grievances || []);
    setOfficerError("");
  } catch (error) {
    setOfficerError("Unable to connect to the backend.");
  }
};
const handleCitizenLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:5001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Login failed");
      return;
    }

    localStorage.setItem("citizenToken", data.token);
    setLoggedInUser(data.user);

    alert("Login successful!");
  } catch (error) {
    alert("Unable to connect to the server.");
  }
};

  const faqs = [
    {
      question: "How can I submit a grievance?",
      answer: "Use the grievance submission section to enter your details and describe your complaint."
    },
    {
      question: "How can I track my complaint?",
      answer: "Use your grievance reference number in the tracking section to check its status."
    },
    {
      question: "Can I submit a grievance online?",
      answer: "Yes. The portal is designed to make grievance submission easier online."
    }
  ];

  return (
    <>
      <header className="navbar">
        <div className="logo">
          <img src={keralaLogo} alt="Government of Kerala" className="kerala-logo" />
Kerala Grievance Portal
        </div>

        <nav>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#departments">Departments</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="nav-buttons">
          <a href="#submit" className="submit-btn">Submit Grievance</a>
          <a href="#track" className="track-btn">Track Status</a>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="tagline">GOVERNMENT OF KERALA</p>
            <h1>
              Your Voice Matters.
              <br />
              <span>We Are Here to Help.</span>
            </h1>
            <p>
              A simple and transparent platform for citizens to submit
              grievances, track complaints and connect with government
              departments.
            </p>
            <a href="#submit" className="submit-btn">Submit a Grievance</a>
            <a href="#track" className="outline-btn">Track Your Complaint</a>
          </div>
        </section>

        <section className="section" id="about">
          <h2>About the Portal</h2>
          <p>
            The CM Kerala Grievance Portal provides a convenient way for
            citizens to raise concerns and follow the progress of their
            complaints through a single online platform.
          </p>
        </section>

<section className="section light" id="login">
  <h2>Citizen Login</h2>
  <p>Login to access your grievance account.</p>

  {loggedInUser ? (
    <div>
      <h3>Welcome, {loggedInUser.name}!</h3>
      <p>You are logged in successfully.</p>
      
{loggedInUser.role === "cmo" && (
  <div className="admin-dashboard">
    <h2>CMO Admin Dashboard</h2>
    <p>Manage and review citizen grievances.</p>

    <button onClick={async () => {
  await loadAdminGrievances();
  await loadOfficers();
}}>
  Load All Grievances
</button>

    {adminError && <p>{adminError}</p>}

    <h3>Total Grievances: {adminGrievances.length}</h3>

    {adminGrievances.map((item) => (
      <div className="grievance-card" key={item.id}>
        <h3>{item.title}</h3>
        <p>Reference: {item.reference_number}</p>
        <p>Citizen: {item.citizen_name}</p>
        <p>Department: {item.department}</p>
        <p>Current Status: {item.status}</p>
      <h4>Assign Department Officer</h4>

<form onSubmit={async (e) => {
  e.preventDefault();

  const officerId = new FormData(e.currentTarget).get("officerId");
  const token = localStorage.getItem("citizenToken");

  try {
    const response = await fetch(
      `http://localhost:5001/api/grievances/admin/${encodeURIComponent(item.reference_number)}/assign`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ officerId }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Assignment failed.");
      return;
    }

    alert("Grievance assigned successfully!");
    await loadAdminGrievances();
  } catch (error) {
    alert("Unable to connect to the server.");
  }
}}>
  <select name="officerId" required defaultValue="">
    <option value="">Select Department Officer</option>
    {officers.map((officer) => (
      <option key={officer.id} value={officer.id}>
        {officer.name} - {officer.department}
      </option>
    ))}
  </select>

  <button type="submit">Assign Officer</button>
</form>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            const form = e.currentTarget;
            const formData = new FormData(form);
            const token = localStorage.getItem("citizenToken");

            try {
              const response = await fetch(
                `http://localhost:5001/api/grievances/admin/${encodeURIComponent(item.reference_number)}/status`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    status: formData.get("status"),
                    remark: formData.get("remark"),
                  }),
                }
              );

              const data = await response.json();

              if (!response.ok) {
                alert(data.message || "Status update failed.");
                return;
              }

              alert("Grievance status updated successfully!");
              await loadAdminGrievances();
            } catch (error) {
              alert("Unable to connect to the server.");
            }
          }}
        >
          <h4>Update Grievance Status</h4>

          <select name="status" defaultValue="Under Review">
            <option value="Under Review">Under Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Reopened">Reopened</option>
          </select>

          <textarea
            name="remark"
            placeholder="Enter CMO remarks..."
            required
          />

          <button type="submit">
            Update Status
          </button>
        </form>
      </div>
    ))}
  </div>
)}
{loggedInUser.role === "officer" && (
  <div className="admin-dashboard">
    <h2>Department Officer Dashboard</h2>
    <p>View and manage grievances assigned to you.</p>
    <p>Welcome, {loggedInUser.name}!</p>

    <button onClick={loadOfficerGrievances}>
      Load Assigned Grievances
    </button>

    {officerError && <p>{officerError}</p>}

    <h3>Total Assigned: {officerGrievances.length}</h3>

    {officerGrievances.map((item) => (
      <div className="grievance-card" key={item.id}>
        <h3>{item.title}</h3>
        <p>Reference: {item.reference_number}</p>
        <p>Citizen: {item.citizen_name}</p>
        <p>Department: {item.department}</p>
        <p>Status: {item.status}</p>
     
<form onSubmit={async (e) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const status = formData.get("status");
  const remark = formData.get("remark");
  const token = localStorage.getItem("citizenToken");

  try {
    const response = await fetch(
      `http://localhost:5001/api/grievances/officer/${encodeURIComponent(item.reference_number)}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, remark }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Status update failed.");
      return;
    }

    alert("Grievance status updated successfully!");
    await loadOfficerGrievances();
  } catch (error) {
    alert("Unable to connect to the server.");
  }
}}>
  <h4>Update Grievance Status</h4>
  <select name="status" defaultValue="In Progress">
    <option value="In Progress">In Progress</option>
    <option value="Resolved">Resolved</option>
  </select>
  <textarea
    name="remark"
    placeholder="Enter investigation remarks..."
    required
  />
  <button type="submit">Update Status</button>
</form>

      </div>
    ))}
  </div>
)}
  
</div>

  ) : (
    <form onSubmit={handleCitizenLogin}>
      <input
        type="email"
        placeholder="Email Address"
        value={loginEmail}
        onChange={(e) => setLoginEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
        required
      />

      <button type="submit" className="submit-btn">
        Login
      </button>
    </form>
  )}
</section>

        <section className="section light" id="services">
          <h2>How It Works</h2>
          <p>Submit and follow your grievance in a few simple steps.</p>

          <div className="steps">
            <div>
              01
              <h3>Submit</h3>
              <p>Enter your complaint and contact details.</p>
            </div>
            <div>
              02
              <h3>Review</h3>
              <p>Your grievance can be reviewed by the concerned team.</p>
            </div>
            <div>
              03
              <h3>Track</h3>
              <p>Check the progress using your reference number.</p>
            </div>
            <div>
              04
              <h3>Resolution</h3>
              <p>Receive updates about the grievance outcome.</p>
            </div>
          </div>
        </section>

        <section className="section" id="departments">
          <h2>Government Departments</h2>
          <p>Select the department related to your grievance.</p>

          <div className="department-list">
            <div>Revenue Department</div>
            <div>Health Department</div>
            <div>Education Department</div>
            <div>Local Self Government</div>
          </div>
        </section>

        <section className="section light" id="submit">
          <h2>Submit a Grievance</h2>
          <p>Enter your details and describe your concern.</p>

          <form
  onSubmit={async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("citizenToken");

    if (!token) {
      alert("Please login before submitting a grievance.");
      return;
    }

    const form = e.currentTarget;

    const body = {
      title: form.elements.title.value,
      description: form.elements.description.value,
      category: form.elements.category.value,
      department: form.elements.department.value
    };

    try {
      const response = await fetch("http://localhost:5001/api/grievances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Grievance submission failed.");
        return;
      }

      alert(
        `Grievance submitted successfully!\nReference Number: ${data.referenceNumber}`
      );

      form.reset();
    } catch (error) {
      alert("Unable to connect to the server.");
    }
  }}
>
  <input
    type="text"
    name="title"
    placeholder="Grievance Title"
    required
  />

  <select name="category" required>
    <option value="">Select Category</option>
    <option value="Public Services">Public Services</option>
    <option value="Infrastructure">Infrastructure</option>
    <option value="Health">Health</option>
    <option value="Education">Education</option>
    <option value="Other">Other</option>
  </select>

  <select name="department" required>
    <option value="">Select Department</option>
    <option value="Revenue Department">Revenue Department</option>
    <option value="Health Department">Health Department</option>
    <option value="Education Department">Education Department</option>
    <option value="Local Self Government">Local Self Government</option>
  </select>

  <textarea
    name="description"
    placeholder="Describe your grievance"
    required
  />

<button
  type="button"
  disabled={aiLoading}
  onClick={async (e) => {
    const form = e.currentTarget.form;
    const title = form.elements.title.value;
    const description = form.elements.description.value;

    if (!title || !description) {
      alert("Please enter the grievance title and description.");
      return;
    }

    setAiLoading(true);
    setAiAnalysis(null);

    try {
      const response = await fetch(
        "http://localhost:5001/api/ai/analyze",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "AI analysis failed.");
        return;
      }

      setAiAnalysis(data.analysis);
    } catch (error) {
      alert("Unable to connect to the AI service.");
    } finally {
      setAiLoading(false);
    }
  }}
>
  {aiLoading ? "Analyzing..." : "Analyze with AI"}
</button>

  
{aiAnalysis && (
  <div className="ai-result">
    <h3>AI Grievance Analysis</h3>
    <p><strong>Category:</strong> {aiAnalysis.category}</p>
    <p><strong>Suggested Department:</strong> {aiAnalysis.department}</p>
    <p><strong>Priority:</strong> {aiAnalysis.priority}</p>
    <p><strong>Summary:</strong> {aiAnalysis.summary}</p>
    <p>
      <strong>Possible Duplicate:</strong>{" "}
      {aiAnalysis.duplicate_flag ? "Yes" : "No"}
    </p>
    <p><strong>Reason:</strong> {aiAnalysis.duplicate_reason}</p>
  </div>
)}

  <button type="submit" className="submit-btn">
    Submit Grievance
  </button>
</form>
        </section>

        <section className="section" id="track">
          <h2>Track Your Grievance</h2>
          <p>Enter your reference number to check your complaint status.</p>

          
<form
  onSubmit={async (e) => {
    e.preventDefault();

    const referenceNumber =
      e.currentTarget.elements.referenceNumber.value.trim();

    try {
      const response = await fetch(
        `http://localhost:5001/api/grievances/track/${encodeURIComponent(referenceNumber)}`
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Grievance not found.");
        return;
      }

      const grievance = data.grievance;

      alert(
        `Grievance Found!\n\nReference: ${grievance.reference_number}\nTitle: ${grievance.title}\nStatus: ${grievance.status}`
      );
    } catch (error) {
      alert("Unable to connect to the server.");
    }
  }}
>
  <input
    type="text"
    name="referenceNumber"
    placeholder="Enter Grievance Reference Number"
    required
  />

  <button type="submit" className="submit-btn">
    Track Status
  </button>
</form>

        </section>

        <section className="section light" id="faq">
          <h2>Frequently Asked Questions</h2>

          {faqs.map((faq, index) => (
            <details
              key={index}
              open={activeFaq === index}
              onToggle={(e) => {
                if (e.currentTarget.open) setActiveFaq(index);
                else if (activeFaq === index) setActiveFaq(null);
              }}
            >
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </section>

        <section className="section" id="contact">
          <h2>Contact Us</h2>
          <p>
            For assistance with the portal, contact the relevant government
            support department.
          </p>
        </section>
      </main>

      <footer>
        <p>CM Kerala Grievance Portal</p>
        <p>Citizen-focused grievance support platform</p>
        <p>© 2026 Government of Kerala. Demo project.</p>
      </footer>
    </>
  );
}

export default App;
