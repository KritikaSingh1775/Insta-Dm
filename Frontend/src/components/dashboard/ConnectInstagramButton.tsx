import { Loader2, Instagram } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/api/http";

const ConnectInstagramButton = () => {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);

      const auth = JSON.parse(localStorage.getItem("athenura.auth") || "{}");

      const token = auth?.accessToken;

      if (!token) {
        alert("Login required");
        return;
      }

      const encoded = encodeURIComponent(token);

      window.location.href = `${API_BASE_URL}/instagram/connect?token=${encoded}`;
    } catch (error) {
      console.error(error);

      alert("Instagram connect failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleConnect} disabled={loading} className="gap-2">
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Instagram className="h-4 w-4" />
      )}

      {loading ? "Connecting..." : "Connect Instagram"}
    </Button>
  );
};

export default ConnectInstagramButton;
