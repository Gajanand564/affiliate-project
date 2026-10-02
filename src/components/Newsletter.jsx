import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Mail } from "lucide-react";
import { subscribe } from "../services/api";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await subscribe(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="newsletter" style={{ padding: "74px 20px", background: "#d9f1fc", borderTop: "1px solid rgba(0,180,216,.15)" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        style={{
          maxWidth: 820,
          margin: "0 auto",
          borderRadius: 8,
          background: "linear-gradient(135deg,#00b4d8,#0077b6)",
          color: "#fff",
          padding: "34px 22px",
          textAlign: "center",
          boxShadow: "0 24px 60px rgba(0,100,160,.22)",
        }}
      >
        <div style={{ width: 54, height: 54, borderRadius: 12, background: "rgba(255,255,255,.12)", display: "grid", placeItems: "center", margin: "0 auto 16px", border: "1px solid rgba(255,255,255,.18)" }}>
          <Mail size={25} />
        </div>
        <h2 style={{ margin: "0 0 8px", fontSize: "clamp(1.55rem,3vw,2.3rem)", fontWeight: 950, letterSpacing: 0 }}>
          Get the best finds before they disappear
        </h2>
        <p style={{ margin: "0 auto 24px", maxWidth: 560, color: "#e0f7ff", lineHeight: 1.7 }}>
          Weekly trend-led home decor and kitchen deals. Useful picks, no spam.
        </p>

        {submitted ? (
          <motion.div initial={{ scale: .95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,.16)", border: "1px solid rgba(255,255,255,.35)", borderRadius: 8, padding: "13px 18px", color: "#fff", fontWeight: 900 }}>
            <CheckCircle size={20} /> You are subscribed
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="Enter your email"
              required
              style={{
                padding: "14px 16px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,.2)",
                background: "rgba(255,255,255,.96)",
                color: "#023e8a",
                fontSize: "16px",
                flex: "1 1 260px",
                maxWidth: 360,
                outline: "none",
              }}
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: .98 }}
              style={{
                padding: "14px 22px",
                borderRadius: 10,
                background: loading ? "#93b4c8" : "#023e8a",
                color: "#fff",
                fontWeight: 950,
                border: "none",
                minWidth: 150,
                cursor: loading ? "wait" : "pointer",
              }}
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </motion.button>
          </form>
        )}
        {error && <p style={{ marginTop: 12, color: "#fecaca", fontSize: ".86rem" }}>{error}</p>}
      </motion.div>
    </section>
  );
}
