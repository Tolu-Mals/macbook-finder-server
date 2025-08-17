const getRatingFromReviewString = (ratingString: string) => {
  if (!ratingString) return {}
  const regex = /(\d[.]?\d?) out of 5(\(\d+\))?/;
  const match = ratingString.match(regex)
  const ratingData = match ? [ ...match ] : null;

  const starRating = Number.parseInt(ratingData?.[1] ?? "n/a");
  const noOfReviewsString = ratingData?.[2] ?? "n/a";
  const noOfReviews = Number.parseInt(noOfReviewsString?.slice(1, noOfReviewsString.length - 1) as string);
  return { starRating, noOfReviews };
}

export default getRatingFromReviewString
