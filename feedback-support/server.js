import express from "express";
import mysql from "mysql2/promise";

const port = 3000;
const host = "localhost";

// Database connection details
const dbHost = "localhost";
const dbName = "feedback_support";
const dbUser = "root";
const dbPwd = "";

const app = express();

// Set view engine (assuming EJS)
app.set("view engine", "ejs");

app.get("/feedback", async (req, res) => {
  let connection; // Declare connection outside try block

  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPwd,
      database: dbName,
    });

    // Execute query to fetch all feedback records
    const [rows] = await connection.execute("SELECT * FROM feedback");

    // Render feedback page with data
    res.render("feedback", { rows });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Internal Server Error");
  } finally {
    // Ensure connection is closed only if it was successfully created
    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.error("Error closing connection:", closeError);
      }
    }
  }
});

app.listen(port, host, () => console.log(`${host}:${port} kuuntelee...`));
