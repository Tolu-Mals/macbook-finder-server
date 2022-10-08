import express from 'express';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { crawlData } from './crawler';
import { getMacbooks } from './firebase';

dotenv.config();

cron.schedule('* * * * Sun', () => {
  //Update the database every sunday
  crawlData();
});

const app = express();

const port = process.env.PORT;

app.get("/macbooks", async (_req, res) => {
  const macbooks = await getMacbooks();
  res.json({ macbooks });
});

app.listen(port, () => console.log(`⚡️[server]: Server is running at http://localhost:${port}`));