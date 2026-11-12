
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret-before-deployment";

// Citizen registration
router.post("/register", (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 6) {
      return res.status(400).json({
        message: "Enter name, email and a password of at least 6 characters."
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const result = db.prepare(`
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, 'citizen')
    `).run(name.trim(), email.trim().toLowerCase(), hashedPassword);

    res.status(201).json({
      message: "Registration successful!",
      userId: Number(result.lastInsertRowid)
    });
  } catch (error) {
    if (error.code === "ERR_SQLITE_ERROR") {
      return res.status(409).json({ message: "Email may already be registered." });
    }

    res.status(500).json({ message: "Registration failed." });
  }
});

// User login
router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = db.prepare(
      "SELECT * FROM users WHERE email = ?"
    ).get(email.trim().toLowerCase());

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed." });
  }
});

module.exports = router;
