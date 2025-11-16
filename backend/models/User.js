  import mongoose from "mongoose";
  import bcrypt from "bcrypt";

  // User Schema
  const userSchema = new mongoose.Schema(
    {
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      resetPasswordToken: { type: String },
      resetPasswordExpires: { type: Date },
      yourname: { type: String },
      birthDay: { type: Date },
      address: { type: String },
      avatar: { type: String },
      position: { type: String },
      country: { type: String },
      gender: { type: String },
      phoneNum: { type: String},
      isActive: { type: Boolean, default: true},
    },
    {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    }
  );

  // Hash password trước khi lưu
  userSchema.pre("save", async function (next) {
    try {
      if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
      }
      next();
    } catch (err) {
      next(err);
    }
  });

  // So sánh mật khẩu
  userSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compare(candidate, this.password);
  };

  // Xóa _id và __v khi trả JSON
  userSchema.set("toJSON", {
    transform: function (doc, ret) {
      delete ret.__v;
    },
  });

export default mongoose.model("User", userSchema);
