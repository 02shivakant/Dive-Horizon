import { ImageResponse } from "next/og";

export const alt = "Dive Horizon, a one-tap sunset runner for Android";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          position: "relative",
          background: "linear-gradient(180deg, #5b3df5 0%, #7a3b52 50%, #f98350 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 140,
            top: 120,
            width: 200,
            height: 200,
            borderRadius: 100,
            background: "#ffc94a",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -200,
            bottom: -420,
            width: 1000,
            height: 640,
            borderRadius: 500,
            background: "#7a3b52",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -240,
            bottom: -440,
            width: 1100,
            height: 640,
            borderRadius: 550,
            background: "#2e4543",
          }}
        />
        <div style={{ display: "flex", fontSize: 128, fontWeight: 800, color: "#fff1dc" }}>Dive Horizon</div>
        <div style={{ display: "flex", fontSize: 38, color: "#fff1dc", marginTop: 16 }}>
          A free one-tap sunset runner for Android
        </div>
      </div>
    ),
    size,
  );
}
