import Crawler, { CrawlerRequestResponse} from 'crawler';
const uuid = require('uuid');
import { saveMacbooks } from './firebase';

export interface Macbook {
  id?: string;
  name?: string;
  image?: string;
  price?: string;
  starRating?: number | string;
  noOfReviews?: number | string;
  url?: string;
  seller?: Seller;
}

interface Seller {
  name?: string;
  followers?: number;
  sellerScore?: string;
  qualityScore?: string;
  customerRating?: string;
  orderFulfillmentRate?: string;
}

type rating = {
  starRating?: number | string;
  noOfReviews?: number | string;
}

export const crawlData = async () => {
  const currentMacbooks: Macbook[] = [];

  // We need to keep track of this value so we can store the seller data in the corresponding macbook object
  let macbookIndex = 0;

  const getRating = (ratingString: string): rating => {
    if(!ratingString) return { starRating: 'nil', noOfReviews: 'nil' }
    const regex = /(\d[.]?\d?) out of 5(\(\d+\))?/;
    const ratingData = ratingString.match(regex);
    const starRating = ratingData?.at(1);
    let noOfReviews: string | number | undefined = ratingData?.at(2);
    noOfReviews = Number(noOfReviews?.slice(1, noOfReviews.length - 1));
    return { starRating, noOfReviews };
  }

  const crawler = new Crawler({
    maxConnections: 1,
    rateLimit: 2000,
    callback: (error, res, done) => {
      if(error) console.log(error);
      else {
        const $ = res.$;
        const productList = $(".-paxs.row._no-g._4cl-3cm-shs > article");
        productList.each(function (_idx, article) {
          const id = uuid.v4();
          let name = $(article).find('.name').text();
          let image = $(article).find('img').attr('data-src') ?? '';
          let price = $(article).find('.prc').text();

          let revs = $(article).find('.rev').text();
          const { starRating, noOfReviews } = getRating(revs);
          let url = $(article).find('a').attr('href') ?? '';
          url = 'https://jumia.com.ng' + url;

          let macbookData = { id, name, image, price, url, starRating, noOfReviews };

          currentMacbooks.push(macbookData);
        });

        let nextPageLink = $('.pg-w.-ptm.-pbxl > a:nth-last-child(2)').attr('href');

        if(nextPageLink){
          nextPageLink = "https://jumia.com.ng" + nextPageLink;
          console.log("Just a minute 🤖, I'm crawling another page...");
          crawler.queue(nextPageLink);
        }
        else {
          console.log("This is the last page");
          console.log("Moving on to crawling the details page...");

          //Generate configs from all the macbooks we stored during the first stage of the web crawling
          //This time around we're all getting all the corresponding seller data
          const crawlerConfigs = currentMacbooks.map((_macbook, index) => {
            return {
              uri: currentMacbooks.at(index)?.url,
            }
          });

          const detailsCrawler = new Crawler({
            maxConnections: 1,
            rateLimit: 2000,
            callback: (error: Error, res: CrawlerRequestResponse, done: () => void) => {
              if(error) console.log(error);
              else {
                const $ = res.$;
                let sellerInfoGroup = $(".-pts > .card");
                const name = $(sellerInfoGroup).find('.-m.-pbs').text();
                const sellerScore = $(sellerInfoGroup).find('.-df.-d-co.-j-bet.-prs > p:first-child > bdo').text();
                const followers = $(sellerInfoGroup).find('.-df.-d-co.-j-bet.-prs > p:nth-child(2) > .-m').text().trim();
                const orderFulfillmentRate = $(sellerInfoGroup).find('.-pas.-bt.-fs12 .-df.-i-ctr.-pts:nth-child(2) p  .-m').text();
                const qualityScore = $(sellerInfoGroup).find('.-pas.-bt.-fs12 .-df.-i-ctr.-pts:nth-child(3) p  .-m').text();
                const customerRating = $(sellerInfoGroup).find('.-pas.-bt.-fs12 .-df.-i-ctr.-pts:nth-child(4) p  .-m').text();

                const sellerObj = { name, sellerScore, followers: Number(followers), orderFulfillmentRate, qualityScore, customerRating };

                currentMacbooks[macbookIndex].seller = sellerObj;
                macbookIndex++;

                if(macbookIndex === currentMacbooks.length){
                  //Store the data when we've fetched all the related seller's data
                  saveMacbooks(currentMacbooks);
                }
              }
              done();
            }
          });
          
          detailsCrawler.queue(crawlerConfigs);
        }
      }
      done();
    }
  });

  console.log("Hi there 🤖, I'm crawling the data for you...");
  crawler.queue("https://www.jumia.com.ng/computers-tablets/apple/?q=macbooks");
}