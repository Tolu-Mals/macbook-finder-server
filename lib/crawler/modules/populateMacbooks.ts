import { Macbook } from '../../../types';
import getRatingFromReviewString from './getRatingFromReviewString';
import {
  NAME_SELECTOR,
  IMAGE_SELECTOR,
  PRICE_SELECTOR,
  DATA_SRC_ATTRIBUTE_SELECTOR,
  REVIEW_SELECTOR,
  PRODUCT_LINK_SELECTOR,
} from './selectors'
import { JUMIA_BASE_URL } from '../constants'
import { v4 as uuidv4 } from 'uuid';

const populateMacbooks = ($: cheerio.CheerioAPI, productList: cheerio.Cheerio, macbooks: Macbook[]) => {
  productList.each(function (_, product) {
    const id = uuidv4();
    const name = $(product).find(NAME_SELECTOR).text();
    const image = $(product).find(IMAGE_SELECTOR).attr(DATA_SRC_ATTRIBUTE_SELECTOR);
    const price = $(product).find(PRICE_SELECTOR).text();
    const reviews = $(product).find(REVIEW_SELECTOR).text();
    const { starRating, noOfReviews } = getRatingFromReviewString(reviews);

    let url = $(product).find(PRODUCT_LINK_SELECTOR).attr('href') ?? '';
    url = JUMIA_BASE_URL + url;

    const macbookData = { id, name, image, price, url, starRating, noOfReviews };

    macbooks.push(macbookData);
  });
}

export default populateMacbooks
