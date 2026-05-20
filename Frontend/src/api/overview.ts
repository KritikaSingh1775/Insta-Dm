import http from "./http";

export interface OverviewStats {
  totalCampaigns: number;
  totalLeads: number;
  totalSent: number;
  replyRate: number;
  activeCampaigns: number;
}

export interface DmSeriesItem {
  day: string;
  dms: number;
  leads: number;
}

export interface CampaignBarItem {
  name: string;
  v: number;
}

export interface RecentActivityItem {
  id: string;
  who: string;
  what: string;
  when: string;
  timestamp: string;
  type: "lead" | "reply" | "campaign";
}

export interface OverviewData {
  stats: OverviewStats;
  charts: {
    dmSeries: DmSeriesItem[];
    campaignBars: CampaignBarItem[];
  };
  recentActivities: RecentActivityItem[];
}

export const getOverview = async (): Promise<{ success: boolean; data: OverviewData }> => {
  const response = await http.get("/overview");
  return response.data;
};

export const overviewApi = {
  get: getOverview,
};
