import Crawler from 'crawler';
import crawlerCallbackFn from './modules/crawlerCallbackFn';

const CRAWLER_RATE_LIMIT = 2000
const CRAWLER_MAX_CONNECTIONS = 1

export interface CrawlerState {
  instance?: Crawler
  macbookIndex: number
}

export const crawlerState: CrawlerState = { macbookIndex: 0 }

export const crawlData = async () => {
  crawlerState.instance = new Crawler({
    maxConnections: CRAWLER_MAX_CONNECTIONS,
    rateLimit: CRAWLER_RATE_LIMIT,
    callback: crawlerCallbackFn
  });

  console.log("Hi there 🤖, I'm crawling the data for you...");
  crawlerState.instance.queue("https://www.jumia.com.ng/computers-tablets/apple/?q=macbooks");
}

