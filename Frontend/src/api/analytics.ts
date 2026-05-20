import http from "./http";

export interface AnalyticsSummary {
  conversionRate: number;
  totalReplies: number;
  mostSuccessfulKeyword: string;
  bestPerformingCampaign: string;
  totalSent: number;
  totalLeads: number;
}

export interface TrendItem {
  d: number;
  date: string;
  sent: number;
  conv: number;
}

export interface CtrItem {
  day: string;
  ctr: number;
}

export interface FunnelItem {
  name: string;
  value: number;
  fill: string;
}

export interface DailyLeadsItem {
  d: number;
  date: string;
  leads: number;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  trend: TrendItem[];
  ctr: CtrItem[];
  funnel: FunnelItem[];
  dailyLeadsGraph: DailyLeadsItem[];
}

export const getAnalytics = async (): Promise<{ success: boolean; data: AnalyticsData }> => {
  const response = await http.get("/analytics");
  return response.data;
};

export const analyticsApi = {
  get: getAnalytics,
};
