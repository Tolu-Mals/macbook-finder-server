import Crawler, { CrawlerRequestResponse, CrawlerRequestOptions } from 'crawler'
import { Macbook } from '../../../types';
import { crawlerState } from '..';
import {
  PRODUCT_LIST_SELECTOR,
  NEXT_PAGE_LINK_SELECTOR,
  SELLER_INFO_GROUP_SELECTOR,
  SELLER_NAME_SELECTOR,
  SELLER_SCORE_SELECTOR,
  SELLER_FOLLOWERS_SELECTOR,
  ORDER_FULFILLMENT_RATE_SELECTOR,
  QUALITY_SCORE_SELECTOR,
  CUSTOMER_RATING_SELECTOR
} from './selectors';
import populateMacbooks from './populateMacbooks'
import { Macbooks } from '../../../models/Macbooks';
import crawlNextPage from './crawlNextPage'

const crawlerCallbackFn: CrawlerRequestOptions['callback'] = (error, res, done) => {
  if (error) console.log(error);

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
      return {
        uri: currentMacbooks.at(index)?.url,
      }
    });

    const detailsCrawler = new Crawler({
      maxConnections: 1,
      rateLimit: 2000,
      callback: (error: Error, res: CrawlerRequestResponse, done: () => void) => {
        if (error) console.log(error);
        else {
          const $ = res.$;
          let sellerInfoGroup = $(SELLER_INFO_GROUP_SELECTOR);
          const name = $(sellerInfoGroup).find(SELLER_NAME_SELECTOR).text();
          const sellerScore = $(sellerInfoGroup).find(SELLER_SCORE_SELECTOR).text();
          const followers = $(sellerInfoGroup).find(SELLER_FOLLOWERS_SELECTOR).text().trim();
          const orderFulfillmentRate = $(sellerInfoGroup).find(ORDER_FULFILLMENT_RATE_SELECTOR).text();
          const qualityScore = $(sellerInfoGroup).find(QUALITY_SCORE_SELECTOR).text();
          const customerRating = $(sellerInfoGroup).find(CUSTOMER_RATING_SELECTOR).text();

          const sellerObj = { name, sellerScore, followers: Number(followers), orderFulfillmentRate, qualityScore, customerRating };

          currentMacbooks[crawlerState.macbookIndex].seller = sellerObj;
          crawlerState.macbookIndex++;

          if (crawlerState.macbookIndex === currentMacbooks.length) {
            //Store the data when we've fetched all the related seller's data
            const macbooks = { macbooks: JSON.stringify(currentMacbooks) }
            Macbooks.create(macbooks).then(() => console.log("Data saved successfully"))
          }
        }
        done();
      }
    });

    detailsCrawler.queue(macbookDetailCrawlConfigs);
  }

  done()
}

export default crawlerCallbackFn
