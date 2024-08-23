import Crawler, { CrawlerRequestResponse, CrawlerRequestOptions } from 'crawler'
import { Macbook } from '../../../types';
import { crawlerState } from '..';
import {
  PRODUCT_LIST_SELECTOR,
  NEXT_PAGE_LINK_SELECTOR,
} from './selectors';
import populateMacbooks from './populateMacbooks'
import crawlNextPage from './crawlNextPage'
import crawlDetailsPage from './getDetailsCrawler';

const currentMacbooks: Macbook[] = []
const crawlerCallbackFn: CrawlerRequestOptions['callback'] = (error, res, done) => {
  if (error) {
    throw new Error('Something went wrong in the crawler callback')
  }

  const $ = res.$;
  const productList = $(PRODUCT_LIST_SELECTOR);

  populateMacbooks($, productList, currentMacbooks)

  let nextPagePath = $(NEXT_PAGE_LINK_SELECTOR).attr('href');

  if (nextPagePath) {
    crawlNextPage(crawlerState, nextPagePath)
  }
  else {
    console.log("[Crawler]: Moving on to crawling the macbook details page...");

    //Generate configs from all the macbooks we stored during the first stage of the web crawling
    //This time around we're all getting all the corresponding seller data
    type CrawlConfig = { uri: string }
    const macbookDetailCrawlConfigs = currentMacbooks.map(({ url }) => {
      return {
        uri: url
      }
    }) as CrawlConfig[];

    if (macbookDetailCrawlConfigs) {
      crawlDetailsPage(crawlerState, currentMacbooks, macbookDetailCrawlConfigs)
    }
  }

  done()
}

export default crawlerCallbackFn
