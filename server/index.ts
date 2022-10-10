import express from 'express';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { crawlData } from './crawler';
import { getMacbooks } from './firebase';
import cors from 'cors';

const app = express();

dotenv.config();
app.use(cors());

cron.schedule('* * * * Sun', () => {
  //Update the database every sunday
  crawlData();
});


const port = process.env.PORT;

app.get("/macbooks", async (_req, res) => {
  const macbookData = await getMacbooks();
  res.json({ macbookData });
});

app.listen(port, () => console.log(`⚡️[server]: Server is running at http://localhost:${port}`));