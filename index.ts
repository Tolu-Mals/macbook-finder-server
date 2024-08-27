import express from 'express';
import { connectDB } from './database';
import cors from 'cors';
import { crawlData } from './lib/crawler';
import { Macbook } from './models/Macbook';

const app = express();

app.use(cors());

const port = process.env.PORT || 5000;

// cron.schedule('* * * * Sun', () => {
//   console.log(`Crawling data on ${new Date().toLocaleDateString()}`);
//   crawlData().then(() => console.log("Saved crawled data successfully"));
// });

app.get('/crawl', async (_, res) => {
  console.log(`[Crawler]: Crawling data on ${new Date().toLocaleDateString()}`);
  crawlData()
  res.status(200).json({ msg: '[Crawler]: Started Crawling Pages...' })
})

app.get("/macbooks", async (_req, res) => {
  try {
    const macbooks = await Macbook.find()
    res.status(200).json(macbooks)
  } catch (error) {
    console.log("Error: ", error)
    res.status(500).json({ msg: 'Could not fetch data' })
  }
});

connectDB().then(() => {
  app.listen(port, () => console.log(`⚡️[server]: Server is running at http://localhost:${port}`));
});
