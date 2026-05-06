import express from "express";
import pg from "pg";
import nodemailer from "nodemailer";

export const app = express();
app.use(express.json());

export const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export const mailer = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 25,
  secure: false,
});

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch {
    res.status(503).json({ status: "db_error" });
  }
});

app.get("/users", async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM users ORDER BY id");
  res.json(rows);
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email]
  );
  await mailer.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Welcome!",
    text: `Hi ${name}, your account was created.`,
  });
  res.status(201).json(rows[0]);
});

if (process.env.NODE_ENV !== "test") {
  app.listen(4000, () => console.log("API listening on :4000"));
}
