const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const port = 3001;

// Enable CORS
app.use(cors());
app.use(express.json());

app.get("/api/documents", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM documents ORDER BY position"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching documents:", err);
    res.status(500).send("Server error");
  }
});



app.put("/api/documents/:type/position", async (req, res) => {
  const { type } = req.params;
  const { newPosition } = req.body;

  if (typeof newPosition !== "number") {
    return res.status(400).send("Position must be a number");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Fetch the current position of the document to update
    const docResult = await client.query(
      "SELECT position FROM documents WHERE type = $1",
      [type]
    );
    const oldPosition = docResult.rows[0]?.position;

    if (oldPosition === undefined) {
      return res.status(404).send("Document not found");
    }

    if (oldPosition !== newPosition) {
      if (oldPosition < newPosition) {
        // Moving forward
        await client.query(
          `
          UPDATE documents
          SET position = position - 1
          WHERE position > $1 AND position <= $2
        `,
          [oldPosition, newPosition]
        );
        // old position = 2, new position = 4
        // update document SET position = position - 1 WHERE position > 2 AND position <= 4
      } else {
        // Moving backward
        await client.query(
          `
          UPDATE documents
          SET position = position + 1
          WHERE position >= $1 AND position < $2
        `,
          [newPosition, oldPosition]
        );
      }
      await client.query(
        "UPDATE documents SET position = $1 WHERE type = $2",
        [newPosition, type]
      );
    }

    await client.query("COMMIT");
    res.json({ type, newPosition });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error updating document position:", err);
    res.status(500).send("Server error");
  } finally {
    client.release();
  }
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
