import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/store/AuthContext";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

export function GoogleButton({
  mode,
  plan,
}: {
  mode: "login" | "signup";
  plan?: string;
}) {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? "/dashboard";

  const handleSuccess = async (credentialResponse: { credential: string }) => {
    const toastId = "google-auth-toast";
    const action = mode === "signup" ? "Creating account" : "Signing in";
    toast.loading(`${action} with Google...`, { id: toastId });
    try {
      await loginWithGoogle(credentialResponse.credential, mode, plan);
      toast.success(
        mode === "signup" ? "Account created! Redirecting..." : "Welcome back!",
        { id: toastId },
      );
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to authenticate",
        { id: toastId },
      );
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          toast.error("Google authentication failed");
        }}
        text={mode === "signup" ? "signup_with" : "signin_with"}
        size="large"
        locale="en"
      />
    </div>
  );
}
