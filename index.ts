import express from "express";
import { connectDB } from "./database";
import cors from "cors";
import { crawlData } from "./lib/crawler";
import { Macbook } from "./models/Macbook";

const DEFAULT_LIMIT = 12;
const DEFAULT_PAGE = 1;

const app = express();

app.use(cors());

const port = process.env.PORT || 3000;

app.get("/crawl", async (_, res) => {
	console.log("[Crawler]: Deleting old records");
	const result = await Macbook.deleteMany({});
	console.log(`[Crawler]: Deleted ${result.deletedCount} macbooks`);
	console.log(`[Crawler]: Crawling data on ${new Date().toLocaleDateString()}`);
	crawlData();
	res.status(200).json({ msg: "[Crawler]: Started operations" });
});

app.get("/macbooks", async (req, res) => {
	try {
		const limit = Number.parseInt(req.query.limit as string) || DEFAULT_LIMIT;
		const page = Number(req.query.page as string) || DEFAULT_PAGE;
		const skip = (page - 1) * limit;
		const total = await Macbook.countDocuments();
		const macbooks = await Macbook.find().limit(limit).skip(skip);

		res
			.status(200)
			.json({
				macbooks,
				page,
				lastUpdated: macbooks[0]?.updatedAt,
				size: macbooks.length,
				total,
			});
	} catch (error) {
		console.log("Error: ", error);
		res.status(500).json({ msg: "Could not fetch data" });
	}
});

app.get("/macbook/:id", async (req, res) => {
	const { id } = req.params;

	if (!id) res.status(400).json({ msg: "Macbook ID is required" });

	const macbook = await Macbook.findById(id);

	res.status(200).json({ macbook });
});

connectDB().then(() => {
	app.listen(port, () =>
		console.log(`⚡️[Server]: Server is running at http://localhost:${port}`),
	);
});
