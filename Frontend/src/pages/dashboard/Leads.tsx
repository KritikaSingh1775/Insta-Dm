import { useEffect, useState } from "react";

import axios from "axios";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";

import { Skeleton } from "@/components/ui/skeleton";

type Lead = {
  _id: string;

  igUsername: string;

  comment: string;

  status: string;

  createdAt: string;

  campaign?: {
    name?: string;
  };
};

export default function Leads() {
  const [q, setQ] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [leads, setLeads] =
    useState<Lead[]>([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await axios.get(
            "http://localhost:5002/api/v1/leads",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        setLeads(
          response.data.data || []
        );
      } catch (error) {
        console.error(
          "FETCH LEADS ERROR:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

  const filtered = leads.filter(
    (lead) =>
      lead.igUsername
        ?.toLowerCase()
        ?.includes(
          q.toLowerCase()
        ) ||
      lead.comment
        ?.toLowerCase()
        ?.includes(
          q.toLowerCase()
        )
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold">
          Leads CRM
        </h2>

        <p className="text-sm text-muted-foreground mt-1">
          Real Instagram leads
        </p>
      </div>

      <div className="glass-card overflow-hidden border border-border rounded-xl">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={q}
              onChange={(e) =>
                setQ(
                  e.target.value
                )
              }
              placeholder="Search leads..."
              className="pl-9"
            />
          </div>

          <span className="text-xs text-muted-foreground ml-auto">
            {filtered.length} leads
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3">
                  Username
                </th>

                <th className="px-4 py-3">
                  Comment
                </th>

                <th className="px-4 py-3">
                  Campaign
                </th>

                <th className="px-4 py-3">
                  Status
                </th>

                <th className="px-4 py-3 text-right">
                  Time
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                Array.from({
                  length: 5,
                }).map((_, i) => (
                  <tr
                    key={i}
                    className="border-b border-border"
                  >
                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-24" />
                    </td>

                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-20" />
                    </td>

                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-28" />
                    </td>

                    <td className="px-4 py-4">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </td>

                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filtered.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No leads found
                  </td>
                </tr>
              ) : (
                filtered.map(
                  (lead) => (
                    <tr
                      key={
                        lead._id
                      }
                      className="border-b border-border hover:bg-secondary/20"
                    >
                      <td className="px-4 py-3 font-medium">
                        @
                        {
                          lead.igUsername
                        }
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {
                          lead.comment
                        }
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {lead
                          .campaign
                          ?.name ||
                          "Instagram Campaign"}
                      </td>

                      <td className="px-4 py-3">
                        <Badge variant="outline">
                          {lead.status ||
                            "new"}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                        {new Date(
                          lead.createdAt
                        ).toLocaleString()}
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}