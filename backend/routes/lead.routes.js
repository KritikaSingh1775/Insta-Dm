import express from "express";

import Lead from "../models/Lead.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find()
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    console.error(
      "GET LEADS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch leads",
    });
  }
});

export default router;