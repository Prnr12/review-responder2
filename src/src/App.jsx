import { useState, useEffect } from "react";

const TONES = [
  { id: "professional", label: "Professional", emoji: "👔", desc: "Polished & business-like" },
  { id: "warm", label: "Warm & Friendly", emoji: "😊", desc: "Personal & caring" },
  { id: "apologetic", label: "Apologetic", emoji: "🙏", desc: "Humble & solution-focused" },
  { id: "confident", label: "Confident", emoji: "💪", desc: "Firm but respectful" },
];

const STAR_RATINGS = [1, 2, 3, 4, 5];

function StarIcon({ filled }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "#F59E0B" : "none"} stroke={filled ? "#F59E0B" : "#6B7280"} strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" opacity="0.9"/>
    </svg>
  );
}

export default function App() {
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [tone, setTone] = useState("professional");
  const [businessName, setBusinessName] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  useEffect(() => {
    setCharCount(review.length);
  }, [review]);

  const generateResponse = async () => {
    if (!review.trim()) {
      setError("Please paste a customer review first.");
      return;
    }
    setError("");
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review, tone, stars, businessName }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setResponse(data.response);
      }
    } catch (e) {
      setError("Network error. Please try again.");
    }

    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setReview("");
    setStars(0);
    setTone("professional");
    setBusinessName("");
    setResponse("");
    setError("");
  };

  const isNegative = stars > 0 && stars <= 3;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0F",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />

      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `
          radial-gradient(ellipse 80% 50% at 20% 20%, rgba(234,179,8,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 80% 80%, rgba(234,179,8,0.04) 0%, transparent 60%)
        `,
      }} />

      <div style={{
        maxWidth: 680,
        margin: "0 auto",
        padding: "40px 20px 80px",
        position: "relative",
        zIndex: 1,
        opacity: animateIn ? 1 : 0,
        transform: animateIn ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}>

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.25)",
            borderRadius: 100, padding: "6px 16px", marginBottom: 20,
          }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "#F59E0B", textTransform: "uppercase" }}>
              AI-Powered Reputation Tool
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(32px, 6vw, 48px)",
            fontWeight: 800,
            color: "#FAFAFA",
            lineHeight: 1.1,
            margin: "0 0 14px",
            letterSpacing: "-0.02em",
          }}>
            Review Responder
          </h1>
          <p style={{ color: "#9CA3AF", fontSize: 16, lineHeight: 1.6, margin: 0, maxWidth: 440, marginInline: "auto" }}>
            Paste any customer review. Get a professional response in seconds — ready to copy straight to Google or Yelp.
          </p>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          padding: "32px 28px",
          backdropFilter: "blur(12px)",
        }}>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#D1D5DB", marginBottom: 8, letterSpacing: "0.04em" }}>
              BUSINESS NAME <span style={{ color: "#6B7280", fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Maple Street Café"
              value={businessName}
              onChange={e => setBusinessName(e.target.value)}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, padding: "12px 16px",
                color: "#F9FAFB", fontSize: 15,
                outline: "none", transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "rgba(234,179,8,0.5)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#D1D5DB", marginBottom: 10, letterSpacing: "0.04em" }}>
              REVIEW STAR RATING <span style={{ color: "#6B7280", fontWeight: 400 }}>(optional but helpful)</span>
            </label>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {STAR_RATINGS.map(s => (
                <button
                  key={s}
                  onClick={() => setStars(stars === s ? 0 : s)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    padding: "4px", borderRadius: 6, transition: "transform 0.15s",
                    transform: stars >= s ? "scale(1.15)" : "scale(1)",
                  }}
                >
                  <StarIcon filled={stars >= s} />
                </button>
              ))}
              {stars > 0 && (
                <span style={{
                  marginLeft: 8, fontSize: 12, fontWeight: 600,
                  color: isNegative ? "#F87171" : "#34D399",
                }}>
                  {isNegative ? "Negative review" : "Positive review"}
                </span>
              )}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#D1D5DB", marginBottom: 10, letterSpacing: "0.04em" }}>
              RESPONSE TONE
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {TONES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  style={{
                    background: tone === t.id ? "rgba(234,179,8,0.12)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${tone === t.id ? "rgba(234,179,8,0.4)" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 10, padding: "10px 14px", cursor: "pointer",
                    textAlign: "left", transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: 16, marginBottom: 2 }}>{t.emoji}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: tone === t.id ? "#F59E0B" : "#E5E7EB" }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, color: "#D1D5DB", marginBottom: 8, letterSpacing: "0.04em" }}>
              <span>PASTE THE CUSTOMER REVIEW</span>
              <span style={{ color: charCount > 0 ? "#6B7280" : "transparent", fontWeight: 400 }}>{charCount} chars</span>
            </label>
            <textarea
              placeholder={`Paste the customer's review here...\n\n"The food was cold and the server was rude. Waited 45 minutes for our order. Won't be back."`}
              value={review}
              onChange={e => setReview(e.target.value)}
              rows={5}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, padding: "14px 16px",
                color: "#F9FAFB", fontSize: 15, lineHeight: 1.6,
                resize: "vertical", outline: "none",
                fontFamily: "'DM Sans', sans-serif",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "rgba(234,179,8,0.5)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>

          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8, padding: "10px 14px", marginBottom: 20,
              color: "#FCA5A5", fontSize: 14,
            }}>
              {error}
            </div>
          )}

          <button
            onClick={generateResponse}
            disabled={loading || !review.trim()}
            style={{
              width: "100%",
              background: loading || !review.trim()
                ? "rgba(234,179,8,0.3)"
                : "linear-gradient(135deg, #F59E0B, #D97706)",
              border: "none", borderRadius: 12,
              padding: "16px", cursor: loading || !review.trim() ? "not-allowed" : "pointer",
              color: "#0A0A0F", fontSize: 16, fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "all 0.2s",
              letterSpacing: "0.01em",
              boxShadow: !loading && review.trim() ? "0 4px 24px rgba(234,179,8,0.3)" : "none",
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: 18, height: 18,
                  border: "2px solid rgba(0,0,0,0.3)",
                  borderTopColor: "#0A0A0F",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                  display: "inline-block",
                }} />
                Generating Response...
              </>
            ) : (
              <>
                <SparkleIcon />
                Generate Response
              </>
            )}
          </button>
        </div>

        {response && (
          <div style={{
            marginTop: 24,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(234,179,8,0.2)",
            borderRadius: 20,
            padding: "28px",
            animation: "fadeSlideUp 0.4s ease forwards",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#34D399", boxShadow: "0 0 8px #34D399",
                }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#34D399", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Response Ready
                </span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleReset}
                  style={{
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8, padding: "7px 14px", cursor: "pointer",
                    color: "#9CA3AF", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  New Review
                </button>
                <button
                  onClick={handleCopy}
                  style={{
                    background: copied ? "rgba(52,211,153,0.15)" : "rgba(234,179,8,0.1)",
                    border: `1px solid ${copied ? "rgba(52,211,153,0.4)" : "rgba(234,179,8,0.3)"}`,
                    borderRadius: 8, padding: "7px 16px", cursor: "pointer",
                    color: copied ? "#34D399" : "#F59E0B",
                    fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                    display: "flex", alignItems: "center", gap: 6,
                    transition: "all 0.2s",
                  }}
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div style={{
              background: "rgba(255,255,255,0.04)", borderRadius: 12,
              padding: "20px", lineHeight: 1.75,
              color: "#E5E7EB", fontSize: 15,
              borderLeft: "3px solid rgba(234,179,8,0.4)",
            }}>
              {response}
            </div>

            <p style={{ fontSize: 12, color: "#6B7280", marginTop: 14, marginBottom: 0, textAlign: "center" }}>
              ✓ Ready to paste directly into Google, Yelp, TripAdvisor, or Facebook
            </p>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <p style={{ fontSize: 12, color: "#4B5563", margin: 0 }}>
            Powered by AI · Trusted by local businesses
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        textarea::placeholder, input::placeholder { color: #4B5563; }
        button:hover:not(:disabled) { opacity: 0.88; }
      `}</style>
    </div>
  );
    }
