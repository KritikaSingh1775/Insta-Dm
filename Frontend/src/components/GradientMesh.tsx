import React from "react";

export function GradientMesh({
  className,
  animate = true,
}: {
  className?: string;
  animate?: boolean;
}) {
  return (
    <>
      <div
        className={
          "absolute top-0 left-1/2 -translate-x-1/2 " +
          "h-[700px] w-[700px] -translate-y-40 rounded-full " +
          "bg-purple-500/15 blur-3xl " +
          (animate ? "animate-floatGlow" : "") +
          " " +
          (className ?? "")
        }
      />

      <div
        className={
          "absolute top-10 right-[-120px] " +
          "h-[460px] w-[460px] rounded-full bg-blue-500/10 blur-3xl " +
          (animate ? "animate-floatGlow [animation-delay:1.5s]" : "")
        }
      />

      <div
        className={
          "absolute bottom-[-140px] left-[-140px] " +
          "h-[420px] w-[420px] rounded-full bg-pink-500/10 blur-3xl " +
          (animate ? "animate-floatGlow [animation-delay:3s]" : "")
        }
      />
    </>
  );
}


