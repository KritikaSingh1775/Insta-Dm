import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    username: String,

    instagramUserId: String,

    comment: String,

    keyword: String,

    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
    },

    dmSent: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Lead =
  mongoose.models.Lead ||
  mongoose.model(
    "Lead",
    leadSchema
  );

export default Lead;