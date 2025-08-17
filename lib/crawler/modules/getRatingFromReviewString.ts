const getRatingFromReviewString = (ratingString: string) => {
  if (!ratingString) return {}
  const regex = /(\d[.]?\d?) out of 5(\(\d+\))?/;
  const match = ratingString.match(regex)
  const ratingData = match ? [ ...match ] : null;

  if(!ratingData) {
    throw Error('Could not extract rating data');
  }

  const starRating = Number.parseInt(ratingData[1]);
  const noOfReviewsString = ratingData[2];
  const noOfReviews = Number.parseInt(noOfReviewsString?.slice(1, noOfReviewsString.length - 1) as string);
  return { starRating, noOfReviews };
}

export default getRatingFromReviewString
