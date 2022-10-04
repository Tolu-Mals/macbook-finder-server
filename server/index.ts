import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const port = process.env.PORT;

app.get("/", (_req, res) => {
  res.send('<h1>⚡️Express + TypeScript server running');
});

app.listen(port, () => console.log(`⚡️[server]: Server is running at http://localhost:${port}`));