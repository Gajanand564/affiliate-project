import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle } from "lucide-react";
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
    <section id="newsletter" style={{ padding: "80px 24px", background: "#fff", borderTop: "1px solid rgba(0,180,216,0.15)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,180,216,0.06) 1px,transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
      <div style={{ maxWidth: 580, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
          <div style={{ width: 68, height: 68, borderRadius: 18, background: "linear-gradient(135deg,#00b4d8,#0077b6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 8px 24px rgba(0,180,216,0.35)" }}>
            <Mail size={30} color="#fff" />
          </div>
          <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 900, color: "#023e8a", marginBottom: 10, letterSpacing: "-0.02em" }}>Never Miss a Deal!</h2>
          <p style={{ color: "#4a7fa5", marginBottom: 32, lineHeight: 1.7 }}>Get the freshest affiliate deals and exclusive discounts straight to your inbox — weekly, no spam.</p>

          {submitted ? (
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "rgba(0,200,81,0.08)", border: "1.5px solid rgba(0,200,81,0.3)", borderRadius: 14, padding: "18px 28px", color: "#00a040", fontWeight: 700, fontSize: "1rem" }}>
              <CheckCircle size={22} /> You're subscribed! 🎉
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="Enter your email address" required
                style={{ padding: "13px 22px", borderRadius: 50, border: "1.5px solid rgba(0,180,216,0.3)", background: "#f0f9ff", color: "#023e8a", fontSize: ".95rem", flex: "1 1 250px", maxWidth: 340, outline: "none", transition: "border-color .2s, box-shadow .2s" }}
                onFocus={e => { e.target.style.borderColor = "#00b4d8"; e.target.style.boxShadow = "0 0 0 3px rgba(0,180,216,0.12)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(0,180,216,0.3)"; e.target.style.boxShadow = "none"; }} />
              <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ padding: "13px 28px", borderRadius: 50, background: loading ? "#93b4c8" : "linear-gradient(135deg,#00b4d8,#0077b6)", color: "#fff", fontWeight: 700, border: "none", boxShadow: "0 6px 20px rgba(0,180,216,0.35)", minWidth: 140, cursor: loading ? "wait" : "pointer" }}>
                {loading ? "Subscribing..." : "Subscribe Free ✉"}
              </motion.button>
            </form>
          )}
          {error && <p style={{ marginTop: 10, color: "#ef4444", fontSize: ".85rem" }}>{error}</p>}
          <p style={{ marginTop: 14, fontSize: ".76rem", color: "#93b4c8" }}>🔒 No spam, ever. Unsubscribe anytime.</p>
        </motion.div>
      </div>
    </section>
  );
}
