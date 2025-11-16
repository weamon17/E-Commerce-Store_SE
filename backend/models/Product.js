  import mongoose from "mongoose";

  // Product Schema
  const productSchema = new mongoose.Schema(
    {
      productId: { type: String, required: true, unique: true },
      productName: { type: String, required: true, unique: true },
      category: { type: String }, 
      saleprice: { type: Number },
      oldprice: { type: Number },  
      image: { type: String},
      quantity:{type: Number},
      description: { type: String },
    }
  );

  productSchema.set("toJSON", {
    transform: function (doc, ret) {
      delete ret.__v;
    },
  });

  export default mongoose.model("Product", productSchema);
