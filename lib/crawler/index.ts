import Crawler from 'crawler';
import crawlerCallbackFn from './modules/crawlerCallbackFn';
import { CRAWLER_RATE_LIMIT, CRAWLER_MAX_CONNECTIONS } from './modules/config';
import { JUMIA_MACBOOK_LISTING_URL } from './constants';

export interface CrawlerState {
  instance?: Crawler
  macbookIndex: number
}

export const crawlerState: CrawlerState = { macbookIndex: 0 }

export const crawlData = () => {
  //Crawl the search results page for "Macbooks" on Jumia
  crawlerState.instance = new Crawler({
    maxConnections: CRAWLER_MAX_CONNECTIONS,
    rateLimit: CRAWLER_RATE_LIMIT,
    callback: crawlerCallbackFn
  });

  crawlerState.instance.queue(JUMIA_MACBOOK_LISTING_URL);
}

