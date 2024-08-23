import { Rating } from "../../../types";

const getRatingFromReviewString = (ratingString: string): Rating => {
  if (!ratingString) return { starRating: 'nil', noOfReviews: 'nil' }
  const regex = /(\d[.]?\d?) out of 5(\(\d+\))?/;
  const ratingData = ratingString.match(regex);
  const starRating = ratingData?.at(1);
  let noOfReviews: string | number | undefined = ratingData?.at(2);
  noOfReviews = Number(noOfReviews?.slice(1, noOfReviews.length - 1));
  return { starRating, noOfReviews };
}

export default getRatingFromReviewString
