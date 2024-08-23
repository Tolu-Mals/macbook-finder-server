export interface IMacbook {
  id?: string;
  name?: string;
  image?: string;
  price?: string;
  starRating?: number | string;
  noOfReviews?: number | string;
  url?: string;
  seller?: ISeller;
}

export interface ISeller {
  name?: string;
  followers?: number;
  sellerScore?: string;
  qualityScore?: string;
  customerRating?: string;
  orderFulfillmentRate?: string;
}

export type IRating = {
  starRating?: number | string;
  noOfReviews?: number | string;
}
