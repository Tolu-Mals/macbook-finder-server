export interface IMacbook {
  id?: string;
  name?: string;
  image?: string;
  price?: number;
  starRating?: number;
  noOfReviews?: number;
  url: string;
  seller?: ISeller;
}

export interface ISeller {
  name?: string;
  followers?: number;
  sellerScore?: number;
  qualityScore?: string;
  customerRating?: string;
  orderFulfillmentRate?: string;
}

export type IRating = {
  starRating?: number
  noOfReviews?: number
}
