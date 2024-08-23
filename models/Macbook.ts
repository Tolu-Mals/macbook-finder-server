import mongoose, { Schema } from 'mongoose';

const SellerSchema = new Schema({
  name: String,
  followers: Number,
  sellerScore: {
    type: Number,
    required: false
  },
  qualityScore: {
    type: String,
    required: false
  },
  customerRating: {
    type: String,
    required: false
  },
  orderFulfillmentRate: {
    type: String,
    required: false
  },
})

const MacbookSchema = new Schema({
  name: String,
  image: String,
  price: Number,
  starRating: Number,
  noOfReviews: Number,
  url: String,
  seller: SellerSchema
}, { timestamps: true });

export const Macbook = mongoose.model('macbook', MacbookSchema);
