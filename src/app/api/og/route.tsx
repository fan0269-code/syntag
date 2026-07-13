import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET(request: Request) {
  const url = new URL(request.url);
  const title = url.searchParams.get("title")?.slice(0, 120) || "Research Theory Knowledge Graph";
  const kind = url.searchParams.get("kind")?.slice(0, 60) || "Syntag";

  return new ImageResponse(
    <div style={{ alignItems: "flex-start", background: "#0a0a0f", color: "#f0f0f5", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", padding: "72px", width: "100%" }}>
      <div style={{ color: "#7dd3fc", display: "flex", fontSize: 28, letterSpacing: "0.12em", textTransform: "uppercase" }}>{kind}</div>
      <div style={{ display: "flex", fontSize: 72, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.08, maxWidth: "1040px" }}>{title}</div>
      <div style={{ alignItems: "center", color: "#8a8a96", display: "flex", fontSize: 30, gap: "18px" }}><span style={{ color: "#4da6ff" }}>Syntag</span><span>Research Theory Knowledge Graph</span></div>
    </div>,
    { width: 1200, height: 630 },
  );
}
