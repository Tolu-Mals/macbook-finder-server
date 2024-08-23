import { CrawlerRequestOptions } from 'crawler'
import { Macbook } from '../../../types';
import { crawlerState } from '..';
import {
  PRODUCT_LIST_SELECTOR,
  NEXT_PAGE_LINK_SELECTOR,
} from './selectors';
import populateMacbooks from './populateMacbooks'
import crawlNextPage from './crawlNextPage'
import crawlDetailsPage from './getDetailsCrawler';

type CrawlConfig = { uri: string }
const crawlerCallbackFn: CrawlerRequestOptions['callback'] = (error, res, done) => {
  if (error) {
    throw new Error('Something went wrong in the crawler callback')
  }

  const currentMacbooks: Macbook[] = []
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
    const macbookDetailCrawlConfigs = currentMacbooks.map((_, index) => {
      const url = currentMacbooks.at(index)?.url
      if (url) return {
        uri: url
      }
      return null
    }).filter((url) => url != null) as CrawlConfig[];

    if (macbookDetailCrawlConfigs) {
      crawlDetailsPage(crawlerState, currentMacbooks, macbookDetailCrawlConfigs)
    }
  }

  done()
}

export default crawlerCallbackFn
