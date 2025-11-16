import mongoose from "mongoose";
const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // tham chiếu tới User
    required: true,
    ref: "User",
  },
  items: [
    {
      productId: { type: String, required: true },
      productName: String,
      image: String,
      oldprice: Number,
      saleprice: Number,
      buyQuantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Cart = mongoose.model("Cart", CartSchema);
export default Cart;
