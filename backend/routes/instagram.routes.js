import express from "express";
import axios from "axios";

import {
  connectInstagram,
  instagramCallback,
  disconnectInstagram,
  getInstagramAccounts,
} from "../controllers/instagram.controller.js";

import { protect } from "../middleware/auth.middleware.js";

import Campaign from "../models/Campaign.js";
import InstagramAccount from "../models/instagramAccount.model.js";
import Lead from "../models/Lead.js";

const router = express.Router();

router.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Instagram routes working 🚀",
  });
});

router.get(
  "/connect",
  protect,
  connectInstagram
);

router.get(
  "/callback",
  instagramCallback
);

router.get(
  "/accounts",
  protect,
  getInstagramAccounts
);

router.delete(
  "/disconnect/:igUserId",
  protect,
  disconnectInstagram
);

router.get("/webhook", (req, res) => {
  try {
    const mode =
      req.query["hub.mode"];

    const token =
      req.query["hub.verify_token"];

    const challenge =
      req.query["hub.challenge"];

    console.log(
      "📩 WEBHOOK VERIFY REQUEST"
    );

    console.log(
      "ENV TOKEN:",
      process.env.META_WEBHOOK_VERIFY_TOKEN
    );

    console.log(
      "QUERY TOKEN:",
      token
    );

    if (
      mode === "subscribe" &&
      token ===
        process.env
          .META_WEBHOOK_VERIFY_TOKEN
    ) {
      console.log(
        "✅ WEBHOOK VERIFIED"
      );

      return res
        .status(200)
        .send(challenge);
    }

    console.log(
      "❌ INVALID VERIFY TOKEN"
    );

    return res.sendStatus(403);
  } catch (error) {
    console.error(
      "❌ WEBHOOK VERIFY ERROR:",
      error
    );

    return res.sendStatus(500);
  }
});

router.post(
  "/webhook",
  async (req, res) => {
    try {
      console.log(
        "📩 INSTAGRAM WEBHOOK:",
        JSON.stringify(
          req.body,
          null,
          2
        )
      );

      const entry =
        req.body.entry?.[0];

      const change =
        entry?.changes?.[0];

      if (!change) {
  return res
    .status(200)
    .send("EVENT_RECEIVED");
}

      console.log(
        "📌 FIELD:",
        change.field
      );

      if (
        change.field !== "comments"
      ) {
        console.log(
          "ℹ️ NOT A COMMENT EVENT"
        );

        return res
          .status(200)
          .send("EVENT_RECEIVED");
      }

      const commentData =
        change.value;

      const commentText =
        commentData?.text
          ?.toLowerCase()
          ?.trim();

      const commenterId =
        commentData?.from?.id;

      const commenterUsername =
        commentData?.from
          ?.username;

      console.log(
        "💬 COMMENT:",
        commentText
      );

      console.log(
        "👤 COMMENT USER:",
        commenterUsername
      );

      const campaigns =
        await Campaign.find({
          status: "active",
        });

      console.log(
        `📦 ACTIVE CAMPAIGNS: ${campaigns.length}`
      );

      campaigns.forEach(
        (campaign) => {
          console.log(
            "📦 CAMPAIGN:",
            campaign._id
          );

          const previewKeywords =
            campaign.triggerKeywords ||
            campaign.keywords ||
            [];

          console.log(
            "🔑 KEYWORDS:",
            previewKeywords
          );
        }
      );

      const matchedCampaign =
        campaigns.find(
          (campaign) => {
            const keywords =
              (
                campaign.triggerKeywords ||
                campaign.keywords ||
                []
              ).map((k) =>
                String(k || "")
                  .toLowerCase()
                  .trim()
              );

            return keywords.some(
              (keyword) =>
                commentText?.includes(
                  keyword
                )
            );
          }
        );

      if (!matchedCampaign) {
        console.log(
          "❌ NO MATCHING CAMPAIGN"
        );

        return res
          .status(200)
          .send("NO_CAMPAIGN");
      }

      console.log(
        "✅ MATCHED CAMPAIGN:",
        matchedCampaign._id
      );

      const igAccount =
        await InstagramAccount.findOne(
          {
            igUserId:
              matchedCampaign.instagramAccount,
          }
        );

      if (!igAccount) {
        console.log(
          "❌ INSTAGRAM ACCOUNT NOT FOUND"
        );

        return res
          .status(200)
          .send("NO_IG_ACCOUNT");
      }

      console.log(
        "✅ IG ACCOUNT FOUND:",
        igAccount.igUsername
      );

      const firstMessageStep =
        matchedCampaign.steps?.find(
          (step) =>
            step.type ===
            "message"
        );

      const messageText =
        firstMessageStep?.value?.trim() ||
        matchedCampaign.autoReplyMessage?.trim() ||
        "Thanks for your comment!";

      console.log(
        "💬 MESSAGE:",
        messageText
      );

      console.log(
        "📤 SENDING PRIVATE REPLY..."
      );

      console.log(
        "💬 COMMENT ID:",
        commentData.id
      );

      const dmResponse =
        await axios.post(
          `https://graph.facebook.com/v19.0/${igAccount.pageId}/messages`,
          {
            recipient: {
              comment_id:
                commentData.id,
            },

            message: {
              text: messageText,
            },
          },
          {
            params: {
              access_token:
                igAccount.accessToken,
            },
          }
        );

      console.log(
        "✅ PRIVATE REPLY SENT"
      );

      console.log(
        "📨 DM RESPONSE:",
        dmResponse.data
      );

      const lead = await Lead.create({
  user: matchedCampaign.user,

  igUserId: commenterId,

  igUsername: commenterUsername,

  dmSent: true,

  status: "new",

  campaigns: [matchedCampaign._id],

  source: "instagram-comment",
});

console.log(
  "✅ LEAD CREATED:",
  lead
);

      return res
        .status(200)
        .send("EVENT_RECEIVED");
    } catch (error) {
      console.error(
        "❌ WEBHOOK ERROR:"
      );

      console.error(
        error.response?.data ||
          error.message ||
          error
      );

      return res
        .status(500)
        .send("ERROR");
    }
  }
);

export default router;

 