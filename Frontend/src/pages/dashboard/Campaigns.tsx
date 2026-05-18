import { useEffect, useState } from "react";

import axios from "axios";

import { Link, useNavigate } from "react-router-dom";

import {
  Plus,
  Pause,
  Play,
  MoreVertical,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Campaign = {
  _id: string;

  name: string;

  status: string;

  triggerKeywords: string[];

  createdAt: string;

  sentCount?: number;

  deliveredCount?: number;

  replyCount?: number;
};

const Stat = ({
  label,
  value,
}: {
  label: string;

  value: number;
}) => {
  return (
    <div>
      <p className="text-zinc-500 text-sm uppercase">
        {label}
      </p>

      <h3 className="text-5xl font-bold mt-2">
        {value}
      </h3>
    </div>
  );
};

export default function Campaigns() {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] =
    useState<Campaign[]>([]);

  const [loading, setLoading] =
    useState(true);

  const fetchCampaigns =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await axios.get(
            "http://localhost:5002/api/v1/campaigns",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const campaignsData =
          response.data.data ||
          [];

        setCampaigns(
          campaignsData
        );
      } catch (error) {
        console.error(
          "FETCH CAMPAIGNS ERROR:",
          error
        );

        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

  const toggleCampaign =
    async (id: string) => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        await axios.patch(
          `http://localhost:5002/api/v1/campaigns/${id}/toggle`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchCampaigns();
      } catch (error) {
        console.error(error);
      }
    };

  const deleteCampaign =
    async (id: string) => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        await axios.delete(
          `http://localhost:5002/api/v1/campaigns/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchCampaigns();
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-white text-xl">
        Loading campaigns...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-5xl font-bold">
            Campaigns
          </h1>

          <p className="text-zinc-400 mt-2">
            Manage your Instagram automation campaigns 🚀
          </p>
        </div>

        <Button
          onClick={() =>
            navigate(
              "/dashboard/campaigns/new"
            )
          }
          className="bg-violet-600 hover:bg-violet-700 text-white rounded-2xl h-14 px-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Campaign
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            No Campaigns Yet
          </h2>

          <p className="text-zinc-400 mb-8">
            Create your first automation campaign.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {campaigns.map((c) => (
            <Card
              key={c._id}
              className="bg-zinc-950 border border-zinc-800 rounded-3xl"
            >
              <CardContent className="p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-4">
                      <h2 className="text-3xl font-bold">
                        {c.name}
                      </h2>

                      <Badge
                        className={`rounded-full px-4 py-1 text-sm ${
                          c.status ===
                          "active"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {c.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-5">
                      {c.triggerKeywords?.map(
                        (
                          keyword,
                          index
                        ) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-zinc-900 text-zinc-200 rounded-full px-4 py-1"
                          >
                            #{keyword}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() =>
                        toggleCampaign(
                          c._id
                        )
                      }
                      className="text-zinc-300 hover:text-white"
                    >
                      {c.status ===
                      "active" ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-zinc-300 hover:text-white">
                          <MoreVertical className="w-6 h-6" />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent className="bg-zinc-900 border border-zinc-800 text-white">
                        <DropdownMenuItem
                          asChild
                        >
                          <Link
                            to={`/dashboard/campaigns/edit/${c._id}`}
                          >
                            Edit Campaign
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            deleteCampaign(
                              c._id
                            )
                          }
                          className="text-red-400"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Campaign
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="border-t border-zinc-800 my-8" />

                <div className="grid grid-cols-3 gap-8">
                  <Stat
                    label="Sent"
                    value={
                      c.sentCount ||
                      0
                    }
                  />

                  <Stat
                    label="Delivered"
                    value={
                      c.deliveredCount ||
                      0
                    }
                  />

                  <Stat
                    label="Replied"
                    value={
                      c.replyCount ||
                      0
                    }
                  />
                </div>

                <div className="mt-8 text-sm text-zinc-500">
                  Created:{" "}
                  {new Date(
                    c.createdAt
                  ).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}