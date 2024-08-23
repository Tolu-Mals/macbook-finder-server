import Crawler, { CrawlerRequestResponse } from "crawler";
import { CrawlerState } from "..";
import { Macbook } from "../../../types";
import { Macbooks } from "../../../models/Macbooks";
import { CRAWLER_MAX_CONNECTIONS, CRAWLER_RATE_LIMIT } from "./config";
import {

  SELLER_INFO_GROUP_SELECTOR,
  SELLER_NAME_SELECTOR,
  SELLER_SCORE_SELECTOR,
  SELLER_FOLLOWERS_SELECTOR,
  ORDER_FULFILLMENT_RATE_SELECTOR,
  QUALITY_SCORE_SELECTOR,
  CUSTOMER_RATING_SELECTOR
} from './selectors'

const crawlDetailsPage = (crawlerState: CrawlerState, currentMacbooks: Macbook[], macbookDetailCrawlConfigs: { uri: string }[]) => {
  const detailsCrawler = new Crawler({
    maxConnections: CRAWLER_MAX_CONNECTIONS,
    rateLimit: CRAWLER_RATE_LIMIT,
    callback: (error: Error, res: CrawlerRequestResponse, done: () => void) => {
      if (error) {
        throw new Error('Something went wrong in the details crawler')
      }
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

export default crawlDetailsPage

