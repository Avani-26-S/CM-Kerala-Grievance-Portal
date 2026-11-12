
const bcrypt = require("bcryptjs");
const db = require("./db");

const name = "Department Officer";
const email = "officer@cmkerala.demo";
const password = "Officer@0123";
const department = "General Administration";
const role = "officer";

const existing = db.prepare(
  "SELECT id FROM users WHERE email = ?"
).get(email);

const hashedPassword = bcrypt.hashSync(password, 10);

if (existing) {
  db.prepare(`
    UPDATE users
    SET password = ?, role = ?, department = ?
    WHERE email = ?
  `).run(hashedPassword, role, department, email);

  console.log("Officer password updated successfully!");
} else {
  db.prepare(`
    INSERT INTO users (name, email, password, role, department)
    VALUES (?, ?, ?, ?, ?)
  `).run(name, email, hashedPassword, role, department);

  console.log("Department Officer account created!");
}

db.close();
