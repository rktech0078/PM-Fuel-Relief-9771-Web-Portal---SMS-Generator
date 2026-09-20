import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "فیول ریلیف ایس ایم ایس پورٹل 9771";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#01411C",
          backgroundImage: "radial-gradient(circle at 50% 30%, #0d5a2c 0%, #002811 100%)",
          fontFamily: "sans-serif",
          color: "#ffffff",
          padding: "40px",
          border: "16px solid #D4AF37",
          position: "relative",
        }}
      >
        {/* Top Gold Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(212, 175, 55, 0.2)",
            border: "2px solid #D4AF37",
            borderRadius: "50px",
            padding: "10px 28px",
            marginBottom: "20px",
            color: "#FDE047",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          <span>عوامی معلوماتی پورٹل • 100 روپے فی لیٹر سبسڈی</span>
        </div>

        {/* Big ⛽ Emoji & Main Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontSize: "110px", lineHeight: "1" }}>⛽</div>
          <div
            style={{
              fontSize: "62px",
              fontWeight: 900,
              color: "#ffffff",
              textAlign: "center",
              lineHeight: "1.2",
            }}
          >
            فیول ریلیف میسج پورٹل
          </div>
        </div>

        {/* Subtitle / Description */}
        <div
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#FDE047",
            textAlign: "center",
            marginBottom: "30px",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            padding: "12px 36px",
            borderRadius: "20px",
            border: "1px solid rgba(253, 224, 71, 0.3)",
          }}
        >
          9771 پر خودکار رجسٹریشن ایس ایم ایس تیار کریں
        </div>

        {/* Features Pills */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            fontSize: "22px",
            color: "#e2e8f0",
          }}
        >
          <div style={{ backgroundColor: "rgba(255,255,255,0.12)", padding: "10px 22px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.2)" }}>
            🛵 موٹرسائیکل (20 لیٹر)
          </div>
          <div style={{ backgroundColor: "rgba(255,255,255,0.12)", padding: "10px 22px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.2)" }}>
            🛺 رکشہ (20 لیٹر)
          </div>
          <div style={{ backgroundColor: "rgba(255,255,255,0.12)", padding: "10px 22px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.2)" }}>
            🚗 800cc کار (30 لیٹر)
          </div>
        </div>

        {/* Bottom Website Link Pill */}
        <div
          style={{
            position: "absolute",
            bottom: "25px",
            fontSize: "22px",
            fontWeight: "bold",
            color: "#a7f3d0",
            letterSpacing: "1px",
          }}
        >
          pm-fuel-relief.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
