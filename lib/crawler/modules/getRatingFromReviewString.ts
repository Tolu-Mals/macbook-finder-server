const getRatingFromReviewString = (ratingString: string) => {
  if (!ratingString) return {}
  const regex = /(\d[.]?\d?) out of 5(\(\d+\))?/;
  const ratingData = ratingString.match(regex);
  const starRating = Number.parseInt(ratingData?.at(1) as string);
  const noOfReviewsString = ratingData?.at(2);
  const noOfReviews = Number.parseInt(noOfReviewsString?.slice(1, noOfReviewsString.length - 1) as string);
  return { starRating, noOfReviews };
}

export default getRatingFromReviewString
