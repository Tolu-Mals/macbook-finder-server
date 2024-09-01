import { CrawlerRequestOptions } from 'crawler'
import { IMacbook } from '../../../types';
import { crawlerState } from '..';
import {
  PRODUCT_LIST_SELECTOR,
  NEXT_PAGE_LINK_SELECTOR,
  HREF_ATTR_SELECTOR
} from './selectors';
import populateMacbooks from './populateMacbooks'
import crawlNextPage from './crawlNextPage'
import crawlDetailsPage from './crawlDetailsPage';

let currentMacbooks: IMacbook[] = []

const crawlerCallbackFn: CrawlerRequestOptions['callback'] = (error, res, done) => {
  console.log("[Crawler/Search]: Started crawling a search page");
  if (error) {
    throw new Error('Something went wrong in the main crawler callback')
  }

  const $ = res.$;
  const productList = $(PRODUCT_LIST_SELECTOR);

  populateMacbooks($, productList, currentMacbooks)

  const nextPagePath = $(NEXT_PAGE_LINK_SELECTOR).attr(HREF_ATTR_SELECTOR);

  //Crawl next page of search results if available
  if (nextPagePath) {
    crawlNextPage(crawlerState, nextPagePath)
  }
  else {
    console.log("[Crawler/Details]: Started crawling details page");

    //Generate configs from all the macbooks we stored during the first stage of the web crawling
    //This time around we're all getting all the corresponding seller data
    const macbookDetailCrawlConfigs = currentMacbooks.map(({ url }) => {
      return {
        uri: url
      }
    });

    if (macbookDetailCrawlConfigs.length > 0) {
      crawlDetailsPage(crawlerState, currentMacbooks, macbookDetailCrawlConfigs)
    }
  }

  done()
}

export default crawlerCallbackFn
