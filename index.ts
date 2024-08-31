import express from 'express';
import { connectDB } from './database';
import cors from 'cors';
import { crawlData } from './lib/crawler';
import { Macbook } from './models/Macbook';

const app = express();

app.use(cors());

const port = process.env.PORT || 5000;

app.get('/crawl', async (_, res) => {
  console.log(`[Crawler]: Crawling data on ${new Date().toLocaleDateString()}`);
  crawlData()
  res.status(200).json({ msg: '[Crawler]: Started Crawling Pages...' })
})

app.get("/macbooks", async (req, res) => {
  try {
    const limit = Number.parseInt(req.query.limit as string) || 10
    const page = Number(req.query.page as string) || 1
    const skip = (page - 1) * limit
    const total = await Macbook.countDocuments()
    const macbooks = await Macbook.find().limit(limit).skip(skip)

    res.status(200).json({ macbooks, page, createdAt: macbooks[0]?.createdAt, total })
  } catch (error) {
    console.log("Error: ", error)
    res.status(500).json({ msg: 'Could not fetch data' })
  }
});

connectDB().then(() => {
  app.listen(port, () => console.log(`⚡️[Server]: Server is running at http://localhost:${port}`));
});
