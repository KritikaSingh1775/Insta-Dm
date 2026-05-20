import mongoose from "mongoose";
import Campaign from "../models/Campaign.js";
import Lead from "../models/Lead.js";

export const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 1. Calculate General Aggregated Stats
    const campaignStats = await Campaign.aggregate([
      { $match: { user: userObjectId } },
      {
        $group: {
          _id: null,
          totalSent: { $sum: "$stats.totalSent" },
          totalReplied: { $sum: "$stats.totalReplied" },
          totalLeads: { $sum: "$stats.totalLeads" },
        },
      },
    ]);

    const totalSent = campaignStats[0]?.totalSent || 0;
    const totalReplied = campaignStats[0]?.totalReplied || 0;
    const totalLeads = campaignStats[0]?.totalLeads || 0;
    const conversionRate = totalSent > 0 ? parseFloat(((totalReplied / totalSent) * 100).toFixed(1)) : 0;

    // 2. Most successful keyword
    const keywordStats = await Lead.aggregate([
      { $match: { user: userObjectId, keyword: { $ne: null, $ne: "" } } },
      { $group: { _id: "$keyword", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);
    const mostSuccessfulKeyword = keywordStats[0]?._id || "N/A";

    // 3. Best performing campaign (by sent/replies)
    const bestCampaign = await Campaign.findOne({ user: userObjectId })
      .sort({ "stats.totalSent": -1, "stats.totalReplied": -1 })
      .select("name");
    const bestPerformingCampaign = bestCampaign?.name || "N/A";

    // 4. 30-day Engagement Trend (DMs sent vs Conversions) and Daily Leads
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyStats = await Lead.aggregate([
      {
        $match: {
          user: userObjectId,
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          leads: { $sum: 1 },
          sent: { $sum: { $cond: [{ $eq: ["$dmSent", true] }, 1, 0] } },
          conv: { $sum: { $cond: [{ $eq: ["$status", "replied"] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Build perfect 30-day arrays to avoid missing dates in charts
    const trend = [];
    const dailyLeadsGraph = [];
    
    // Day-by-day CTR values for a general week distribution as required by UI
    const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dailyCtrMap = {};
    weekdayNames.forEach(w => {
      dailyCtrMap[w] = { sent: 0, replied: 0 };
    });

    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split("T")[0]; // YYYY-MM-DD
      const dayLabel = d.getDate(); // day number for X-axis in 30-day chart
      const dayName = weekdayNames[d.getDay()];

      const matchedDay = dailyStats.find((item) => item._id === dateString);
      const daySent = matchedDay ? matchedDay.sent : 0;
      const dayConv = matchedDay ? matchedDay.conv : 0;
      const dayLeads = matchedDay ? matchedDay.leads : 0;

      trend.push({
        d: dayLabel,
        date: dateString,
        sent: daySent,
        conv: dayConv,
      });

      dailyLeadsGraph.push({
        d: dayLabel,
        date: dateString,
        leads: dayLeads,
      });

      // Accumulate CTR weekly stats
      dailyCtrMap[dayName].sent += daySent;
      dailyCtrMap[dayName].replied += dayConv;
    }

    // Format CTR for weekly chart (Mon-Sun CTR percentage)
    const ctr = weekdayNames.map(day => {
      const sent = dailyCtrMap[day].sent;
      const replied = dailyCtrMap[day].replied;
      const rate = sent > 0 ? parseFloat(((replied / sent) * 100).toFixed(1)) : 0;
      return {
        day,
        ctr: rate,
      };
    });

    // 5. Funnel Drop-off stages
    // Stages: DMs Sent -> Delivered -> Replied -> Won (leads with won status)
    const wonLeadsCount = await Lead.countDocuments({ user: userObjectId, status: "won" });
    const funnel = [
      { name: "DMs sent", value: totalSent, fill: "hsl(263 90% 66%)" },
      { name: "Delivered", value: totalSent, fill: "hsl(280 92% 70%)" }, // Delivered = successful sends
      { name: "Replied", value: totalReplied, fill: "hsl(220 90% 65%)" },
      { name: "Converted", value: wonLeadsCount, fill: "hsl(152 75% 50%)" },
    ];

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          conversionRate,
          totalReplies: totalReplied,
          mostSuccessfulKeyword,
          bestPerformingCampaign,
          totalSent,
          totalLeads,
        },
        trend,
        ctr,
        funnel,
        dailyLeadsGraph,
      },
    });
  } catch (error) {
    console.error("GET ANALYTICS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics data",
    });
  }
};
