import mongoose from "mongoose";

const instagramAccountSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },

      igUserId: {
        type: String,

        required: true,

        unique: true,
      },

      igUsername: {
        type: String,

        required: true,
      },

      pageId: {
        type: String,

        required: true,
      },

      pageName: {
        type: String,
      },

      accessToken: {
        type: String,

        required: true,
      },

      profilePicture: {
        type: String,
      },

      tokenExpiresAt: {
        type: Date,
      },

      connectedAt: {
        type: Date,

        default: Date.now,
      },

      isActive: {
        type: Boolean,

        default: true,
      },

      webhookSubscribed: {
        type: Boolean,

        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

instagramAccountSchema.index({
  user: 1,
});

const InstagramAccount =
  mongoose.model(
    "InstagramAccount",
    instagramAccountSchema
  );

export default InstagramAccount;