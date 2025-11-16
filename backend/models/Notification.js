import mongoose from "mongoose";

const notiSchema = new mongoose.Schema(
  {
    isRead: {
        type: Boolean,
        default: false 
    },
    title: { type: String, required: true }, 
    content: { type: String, required: true }, 
  },
  {
    timestamps: true, 
  }
);

notiSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
  },
});

export default mongoose.model("Notification", notiSchema);