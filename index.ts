import express from 'express';
import { connectDB } from './database';
import cors from 'cors';
import { crawlData } from './crawler';
import { Macbooks } from './models/Macbooks';
import cron from 'node-cron';

connectDB();

const app = express();

app.use(cors());

const port = process.env.PORT || 5000;

cron.schedule('* * * * Sun', () => {
  console.log(`Crawling data on ${new Date().toLocaleDateString()}`);
  crawlData().then(() => console.log("Saved crawled data successfully"));
});

app.get("/macbooks", async (_req, res) => {
  Macbooks.findOne().sort('-created').exec(function (error, macbooks) {
    if(error) throw error;
    res.status(200).json(macbooks);
  });
});

app.listen(port, () => console.log(`⚡️[server]: Server is running at http://localhost:${port}`));