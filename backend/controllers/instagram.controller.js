import jwt from "jsonwebtoken";
import axios from "axios";

import InstagramAccount from "../models/instagramAccount.model.js";
import env from "../config/env.js";

export const connectInstagram = async (req, res) => {
  try {
    const token = req.query.token;

    if (!token) {
      return res.redirect(`${env.FRONTEND_URL}/login`);
    }

    const redirectUri = env.INSTAGRAM_REDIRECT_URI;

    const scopes = [
      "instagram_basic",
      "instagram_manage_messages",
      "instagram_manage_comments",
      "pages_show_list",
      "pages_read_engagement",
      "pages_manage_metadata",
      "pages_messaging",
      "business_management",
    ];

    const authUrl =
      `https://www.facebook.com/v19.0/dialog/oauth` +
      `?client_id=${env.INSTAGRAM_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${scopes.join(",")}` +
      `&response_type=code` +
      `&state=${token}`;

    console.log("INSTAGRAM AUTH URL:", authUrl);

    return res.redirect(authUrl);
  } catch (error) {
    console.error("CONNECT INSTAGRAM ERROR:", error.message);

    return res.redirect(
      `${env.FRONTEND_URL}/dashboard/settings?error=instagram_connect_failed`
    );
  }
};

export const instagramCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    console.log("CALLBACK CODE:", code);
    console.log("CALLBACK STATE:", state);

    if (!code) {
      return res.redirect(
        `${env.FRONTEND_URL}/dashboard/settings?error=no_code`
      );
    }

    // Verify state payload
    const decoded = jwt.verify(state, env.JWT_SECRET);
    const userId = decoded.userId;

    // Get access token from Facebook Graph API
    const tokenResponse = await axios.get(
      "https://graph.facebook.com/v19.0/oauth/access_token",
      {
        params: {
          client_id: env.INSTAGRAM_CLIENT_ID,
          client_secret: env.INSTAGRAM_CLIENT_SECRET,
          redirect_uri: env.INSTAGRAM_REDIRECT_URI,
          code,
        },
      }
    );

    console.log("TOKEN RESPONSE:", tokenResponse.data);

    const accessToken = tokenResponse.data.access_token;

    // Fetch managed Facebook pages
    const pagesResponse = await axios.get(
      "https://graph.facebook.com/v19.0/me/accounts",
      {
        params: {
          access_token: accessToken,
        },
      }
    );

    console.log("PAGES RESPONSE:", pagesResponse.data);

    const pages = pagesResponse.data.data;

    if (!pages?.length) {
      return res.redirect(
        `${env.FRONTEND_URL}/dashboard/settings?error=no_pages`
      );
    }

    const page = pages[0];

    // Fetch Instagram business info linked to the page
    const igBusinessResponse = await axios.get(
      `https://graph.facebook.com/v19.0/${page.id}`,
      {
        params: {
          fields: "instagram_business_account",
          access_token: page.access_token,
        },
      }
    );

    console.log("IG BUSINESS RESPONSE:", igBusinessResponse.data);

    const igBusiness = igBusinessResponse.data.instagram_business_account;

    if (!igBusiness?.id) {
      return res.redirect(
        `${env.FRONTEND_URL}/dashboard/settings?error=no_instagram_business`
      );
    }

    // Fetch Instagram profile details
    const igProfileResponse = await axios.get(
      `https://graph.facebook.com/v19.0/${igBusiness.id}`,
      {
        params: {
          fields: "id,username,profile_picture_url",
          access_token: page.access_token,
        },
      }
    );

    console.log("IG PROFILE:", igProfileResponse.data);

    const igProfile = igProfileResponse.data;

    // Save or update linked Instagram account in DB
    const savedAccount = await InstagramAccount.findOneAndUpdate(
      {
        igUserId: igProfile.id,
      },
      {
        user: userId,
        igUserId: igProfile.id,
        igUsername: igProfile.username,
        pageId: page.id,
        pageName: page.name,
        accessToken: page.access_token,
        connectedAt: new Date(),
        isActive: true,
        webhookSubscribed: false,
      },
      {
        upsert: true,
        new: true,
      }
    );

    console.log("ACCOUNT SAVED:", savedAccount);

    // Subscribe page to Facebook webhook events
    try {
      const subscribeResponse = await axios.post(
        `https://graph.facebook.com/v19.0/${page.id}/subscribed_apps`,
        {},
        {
          params: {
            subscribed_fields: "messages,messaging_postbacks,feed",
            access_token: page.access_token,
          },
        }
      );

      console.log("✅ WEBHOOK SUBSCRIBED:", subscribeResponse.data);

      savedAccount.webhookSubscribed = true;
      await savedAccount.save();
    } catch (subscribeError) {
      console.error(
        "WEBHOOK SUBSCRIBE ERROR:",
        subscribeError.response?.data || subscribeError.message
      );
    }

    return res.redirect(
      `${env.FRONTEND_URL}/dashboard/settings?success=instagram_connected`
    );
  } catch (error) {
    console.error(
      "Instagram callback error:",
      error.response?.data || error.message
    );

    return res.redirect(
      `${env.FRONTEND_URL}/dashboard/settings?error=instagram_callback_failed`
    );
  }
};

export const getInstagramAccounts = async (req, res) => {
  try {
    const accounts = await InstagramAccount.find({
      user: req.userId,
      isActive: true,
    });

    return res.status(200).json({
      success: true,
      accounts,
    });
  } catch (error) {
    console.error("GET INSTAGRAM ACCOUNTS ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch Instagram accounts",
    });
  }
};

export const disconnectInstagram = async (req, res) => {
  try {
    const { igUserId } = req.params;

    await InstagramAccount.findOneAndDelete({
      igUserId,
      user: req.userId,
    });

    return res.status(200).json({
      success: true,
      message: "Instagram disconnected successfully",
    });
  } catch (error) {
    console.error("DISCONNECT INSTAGRAM ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to disconnect Instagram",
    });
  }
};