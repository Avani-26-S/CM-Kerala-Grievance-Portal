
const express = require("express");
const db = require("../db");
const jwt = require("jsonwebtoken");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Verify logged-in user
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Login required." });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

// Submit grievance
router.post("/", authenticate, (req, res) => {
  try {
    const { title, description, category, department } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required."
      });
    }

    const referenceNumber =
      "CMK-" + Date.now().toString();

    const result = db.prepare(`
      INSERT INTO grievances
      (reference_number, citizen_id, title, description, category, department)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      referenceNumber,
      req.user.id,
      title.trim(),
      description.trim(),
      category || "General",
      department || "To Be Assigned"
    );

    db.prepare(`
      INSERT INTO status_history
      (grievance_id, status, remark, changed_by)
      VALUES (?, 'Submitted', 'Grievance submitted by citizen', ?)
    `).run(Number(result.lastInsertRowid), req.user.id);

    res.status(201).json({
      message: "Grievance submitted successfully!",
      referenceNumber,
      status: "Submitted"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to submit grievance."
    });
  }
});

// Track grievance
router.get("/track/:referenceNumber", (req, res) => {
  try {
    const grievance = db.prepare(`
      SELECT reference_number, title, description,
             category, department, priority, status,
             created_at, updated_at
      FROM grievances
      WHERE reference_number = ?
    `).get(req.params.referenceNumber);

    if (!grievance) {
      return res.status(404).json({
        message: "Grievance not found."
      });
    }

    const history = db.prepare(`
      SELECT status, remark, changed_at
      FROM status_history
      WHERE grievance_id = (
        SELECT id FROM grievances WHERE reference_number = ?
      )
      ORDER BY id ASC
    `).all(req.params.referenceNumber);

    res.json({ grievance, history });
  } catch (error) {
    res.status(500).json({ message: "Unable to track grievance." });
  }
});

// CMO: View all grievances
router.get("/admin/all", authenticate, (req, res) => {
  try {
    if (req.user.role !== "cmo") {
      return res.status(403).json({
        message: "Access denied. CMO role required."
      });
    }

    const grievances = db.prepare(`
      SELECT
        g.*,
        u.name AS citizen_name,
        u.email AS citizen_email
      FROM grievances g
      JOIN users u ON g.citizen_id = u.id
      ORDER BY g.created_at DESC
    `).all();

    res.json({
      total: grievances.length,
      grievances
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to retrieve grievances."
    });
  }
});

// CMO: Update grievance status
router.patch("/admin/:referenceNumber/status", authenticate, (req, res) => {
  try {
    if (req.user.role !== "cmo") {
      return res.status(403).json({
        message: "Access denied. CMO role required."
      });
    }

    const { status, remark } = req.body;

    const allowedStatuses = [
      "Under Review",
      "In Progress",
      "Resolved",
      "Reopened"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid grievance status."
      });
    }

    const grievance = db.prepare(
      "SELECT id FROM grievances WHERE reference_number = ?"
    ).get(req.params.referenceNumber);

    if (!grievance) {
      return res.status(404).json({
        message: "Grievance not found."
      });
    }

    db.prepare(
      "UPDATE grievances SET status = ? WHERE id = ?"
    ).run(status, grievance.id);

    db.prepare(`
      INSERT INTO status_history
      (grievance_id, status, remark, changed_by)
      VALUES (?, ?, ?, ?)
    `).run(
      grievance.id,
      status,
      remark || "Status updated by CMO",
      req.user.id
    );

    res.json({
      message: "Grievance status updated successfully.",
      referenceNumber: req.params.referenceNumber,
      status
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to update grievance status."
    });
  }
});

// OFFICER: View assigned grievances
router.get("/officer/assigned", authenticate, (req, res) => {
  try {
    if (req.user.role !== "officer") {
      return res.status(403).json({
        message: "Access denied. Officer role required."
      });
    }

    const grievances = db.prepare(`
      SELECT
        g.*,
        u.name AS citizen_name
      FROM grievances g
      JOIN users u ON g.citizen_id = u.id
      WHERE g.assigned_officer_id = ?
      ORDER BY g.created_at DESC
    `).all(req.user.id);

    res.json({ grievances });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to load assigned grievances."
    });
  }
});


// OFFICER: Update assigned grievance
router.patch("/officer/:referenceNumber/status", authenticate, (req, res) => {
  try {
    if (req.user.role !== "officer") {
      return res.status(403).json({
        message: "Access denied. Officer role required."
      });
    }

    const { status, remark } = req.body;

    const allowedStatuses = ["In Progress", "Resolved"];

    if (!allowedStatuses.includes(status) || !remark?.trim()) {
      return res.status(400).json({
        message: "Select a valid status and enter remarks."
      });
    }

    const grievance = db.prepare(`
      SELECT id FROM grievances
      WHERE reference_number = ?
      AND assigned_officer_id = ?
    `).get(req.params.referenceNumber, req.user.id);

    if (!grievance) {
      return res.status(404).json({
        message: "Assigned grievance not found."
      });
    }

    db.prepare(`
      UPDATE grievances
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, grievance.id);

    db.prepare(`
      INSERT INTO status_history
      (grievance_id, status, remark, changed_by)
      VALUES (?, ?, ?, ?)
    `).run(grievance.id, status, remark.trim(), req.user.id);

    res.json({
      message: "Grievance status updated successfully.",
      status
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to update grievance."
    });
  }
});

// CMO: Assign grievance to a department officer
router.patch("/admin/:referenceNumber/assign", authenticate, (req, res) => {
  try {
    if (req.user.role !== "cmo") {
      return res.status(403).json({
        message: "CMO access required."
      });
    }

    const { officerId } = req.body;

    if (!officerId) {
      return res.status(400).json({
        message: "Officer ID is required."
      });
    }

    const officer = db.prepare(`
      SELECT id, department
      FROM users
      WHERE id = ? AND role = 'officer'
    `).get(officerId);

    if (!officer) {
      return res.status(404).json({
        message: "Department officer not found."
      });
    }

    const grievance = db.prepare(`
      SELECT id
      FROM grievances
      WHERE reference_number = ?
    `).get(req.params.referenceNumber);

    if (!grievance) {
      return res.status(404).json({
        message: "Grievance not found."
      });
    }

    db.prepare(`
      UPDATE grievances
      SET assigned_officer_id = ?,
          department = ?,
          status = 'In Progress',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(officer.id, officer.department, grievance.id);

    db.prepare(`
      INSERT INTO status_history
      (grievance_id, status, remark, changed_by)
      VALUES (?, ?, ?, ?)
    `).run(
      grievance.id,
      "In Progress",
      "Grievance assigned to department officer.",
      req.user.id
    );

    res.json({
      message: "Grievance assigned successfully.",
      officerId: officer.id,
      department: officer.department
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to assign grievance."
    });
  }
});

 // CMO: Get department officers
router.get("/admin/officers", authenticate, (req, res) => {
  try {
    if (req.user.role !== "cmo") {
      return res.status(403).json({
        message: "CMO access required."
      });
    }

    const officers = db.prepare(`
      SELECT id, name, email, department
      FROM users
      WHERE role = 'officer'
    `).all();

   console.log("Officers found:", officers);
res.json({ officers });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to load officers."
    });
  }
});
// Department Officer: View assigned grievances
router.get("/officer/assigned", authenticate, (req, res) => {
  try {
    if (req.user.role !== "officer") {
      return res.status(403).json({
        message: "Officer access required."
      });
    }

    const grievances = db.prepare(`
      SELECT
        g.*,
        c.name AS citizen_name
      FROM grievances g
      LEFT JOIN users c ON c.id = g.citizen_id
      WHERE g.assigned_officer_id = ?
      ORDER BY g.created_at DESC
    `).all(req.user.id);

    res.json({ grievances });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to load assigned grievances."
    });
  }
});
module.exports = router;
