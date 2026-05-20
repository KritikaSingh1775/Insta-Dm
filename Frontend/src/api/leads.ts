import http from "./http";

export interface Lead {
  _id: string;
  igUserId: string;
  igUsername: string;
  source: string;
  status: "new" | "contacted" | "replied" | "won" | "lost";
  dmSent: boolean;
  notes: string;
  tags: string[];
  comment?: string;
  keyword?: string;
  lastContacted: string;
  campaigns?: Array<{
    _id: string;
    name: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export const getLeads = async (): Promise<{ success: boolean; count: number; data: Lead[] }> => {
  const response = await http.get("/leads");
  return response.data;
};

export const updateLead = async (
  id: string,
  data: { status?: string; notes?: string; tags?: string[] }
): Promise<{ success: boolean; message: string; data: Lead }> => {
  const response = await http.put(`/leads/${id}`, data);
  return response.data;
};

export const leadApi = {
  getAll: getLeads,
  update: updateLead,
};
