import type { IMacbook } from "../../../types";
import getRatingFromReviewString from "./getRatingFromReviewString";
import {
	NAME_SELECTOR,
	IMAGE_SELECTOR,
	PRICE_SELECTOR,
	DATA_SRC_ATTRIBUTE_SELECTOR,
	REVIEW_SELECTOR,
	PRODUCT_LINK_SELECTOR,
} from "./selectors";
import { JUMIA_BASE_URL } from "../constants";
import convertNairaStringToFloat from "./convertNairaStringtoFloat";

const populateMacbooks = (
	$: cheerio.CheerioAPI,
	productList: cheerio.Cheerio,
	macbooks: IMacbook[],
) => {
	productList.each((_, product) => {
		const name = $(product).find(NAME_SELECTOR).text();
		const image = $(product)
			.find(IMAGE_SELECTOR)
			.attr(DATA_SRC_ATTRIBUTE_SELECTOR);
		const price = convertNairaStringToFloat(
			$(product).find(PRICE_SELECTOR).text(),
		);
		const reviews = $(product).find(REVIEW_SELECTOR).text();
		const ratingFromReviews = getRatingFromReviewString(reviews);
		const starRating = ratingFromReviews?.starRating
		const noOfReviews = ratingFromReviews?.noOfReviews

		if(!starRating || !noOfReviews){
			throw Error("Could not extract star rating or no of reviews")
		}

		let url = $(product).find(PRODUCT_LINK_SELECTOR).attr("href") ?? "";
		url = JUMIA_BASE_URL + url;

		const macbookData = { name, image, price, url, starRating, noOfReviews };

		macbooks.push(macbookData);
	});
};

export default populateMacbooks;
