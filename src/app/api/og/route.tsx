import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET(request: Request) {
  const url = new URL(request.url);
  const title = url.searchParams.get("title")?.slice(0, 120) || "Doctoral theory navigation (education & sociology)";
  const kind = url.searchParams.get("kind")?.slice(0, 60) || "Syrtag";

  return new ImageResponse(
    <div style={{ alignItems: "flex-start", background: "#f4efe2", color: "#2c2722", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", padding: "64px", width: "100%" }}>
      <div style={{ color: "#746a5d", display: "flex", fontSize: 24, letterSpacing: "0.01em" }}>{kind}</div>
      <div style={{ display: "flex", fontSize: 64, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.08, maxWidth: "1000px" }}>{title}</div>
      <div style={{ alignItems: "center", color: "#6b6256", display: "flex", fontSize: 28, gap: "16px" }}><div style={{ background: "#1a4d7f", borderRadius: "6px", height: "12px", width: "12px" }} /><span style={{ color: "#1a4d7f" }}>Syrtag</span><span>Education and sociology</span></div>
    </div>,
    { width: 1200, height: 630 },
  );
}
