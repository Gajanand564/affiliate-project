import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getDeals, createDeal, updateDeal, deleteDeal, getCategories, uploadImage, IMG_BASE } from "../services/api";
import { Plus, Pencil, Trash2, X, Star, ToggleLeft, ToggleRight, Search, ExternalLink, Upload, ImageIcon } from "lucide-react";

const EMOJIS = ["🎧","🖥️","🖱️","🎮","👟","👖","⌚","🧹","📖","☕","💻","📱","🎒","🏠","✈️","💪","🍲","📚","🧳","🎯","🎵","📷","🎨","🏋️","🌿","🍕","🚗","💄","🧴","🔋"];

const GRADIENTS = [
  { id: "from-cyan-500 to-blue-600",      a: "#06b6d4", b: "#2563eb", label: "Ocean"   },
  { id: "from-purple-500 to-blue-500",    a: "#8b5cf6", b: "#3b82f6", label: "Purple"  },
  { id: "from-green-500 to-teal-600",     a: "#22c55e", b: "#0d9488", label: "Green"   },
  { id: "from-orange-500 to-red-500",     a: "#f97316", b: "#ef4444", label: "Fire"    },
  { id: "from-indigo-500 to-purple-600",  a: "#6366f1", b: "#9333ea", label: "Indigo"  },
  { id: "from-blue-600 to-indigo-700",    a: "#2563eb", b: "#4338ca", label: "Navy"    },
  { id: "from-emerald-500 to-green-600",  a: "#10b981", b: "#16a34a", label: "Emerald" },
  { id: "from-amber-500 to-yellow-600",   a: "#f59e0b", b: "#ca8a04", label: "Amber"   },
  { id: "from-rose-500 to-red-600",       a: "#f43f5e", b: "#dc2626", label: "Rose"    },
  { id: "from-fuchsia-500 to-purple-600", a: "#d946ef", b: "#9333ea", label: "Fuchsia" },
];

const EMPTY = {
  title: "", desc: "", category: "", emoji: "🎧", badge: "", discount: "",
  price: "", original: "", rating: 4.5, reviews: 0, featured: false,
  active: true, affiliateUrl: "", gradient: GRADIENTS[0].id,
};

const inp = {
  width: "100%", padding: "10px 14px", borderRadius: 10,
  border: "1.5px solid #d0eaf8", background: "#f7fbff",
  color: "#023e8a", fontSize: ".9rem", outline: "none",
  transition: "border-color .15s, box-shadow .15s",
};
const lbl = {
  fontSize: ".75rem", fontWeight: 700, color: "#4a7fa5",
  display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: ".05em",
};

function Field({ label, children }) {
  return (
    <div>
      <label style={lbl}>{label}</label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, required, type = "text" }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
      style={inp}
      onFocus={e => { e.target.style.borderColor = "#00b4d8"; e.target.style.boxShadow = "0 0 0 3px rgba(0,180,216,0.1)"; }}
      onBlur={e => { e.target.style.borderColor = "#d0eaf8"; e.target.style.boxShadow = "none"; }} />
  );
}

export default function DealsManager() {
  const [deals, setDeals]         = useState([]);
  const [cats, setCats]           = useState([]);
  const [modal, setModal]         = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [tab, setTab]             = useState("basic");
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imgPreview, setImgPreview] = useState(null);
  const fileRef = useRef();

  const load = () => {
    setLoading(true);
    Promise.all([getDeals(), getCategories()])
      .then(([d, c]) => { setDeals(d); setCats(c); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd  = () => { setForm({ ...EMPTY }); setTab("basic"); setImgPreview(null); setModal("add"); };
  const openEdit = (d) => { setForm({ ...d }); setTab("basic"); setImgPreview(d.image ? IMG_BASE + d.image : null); setModal(d); };
  const closeModal = () => setModal(null);

  const f = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const fb = (key) => (e) => setForm({ ...form, [key]: e.target.checked });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      setForm(prev => ({ ...prev, image: url }));
      setImgPreview(IMG_BASE + url);
    } catch {
      alert("Image upload failed. Check file size (max 5MB) and format.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setForm(prev => ({ ...prev, image: "" }));
    setImgPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === "add") await createDeal(form);
      else await updateDeal(modal.id, form);
      load(); closeModal();
    } catch { } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this deal?")) return;
    setDeleting(id);
    try { await deleteDeal(id); load(); } catch { } finally { setDeleting(null); }
  };

  const filtered = deals.filter((d) =>
    d.title?.toLowerCase().includes(search.toLowerCase()) ||
    d.category?.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = [
    { id: "basic",    label: "Basic Info" },
    { id: "pricing",  label: "Pricing"    },
    { id: "display",  label: "Display"    },
    { id: "settings", label: "Settings"   },
  ];

  return (
    <div>
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#023e8a" }}>Deals Management</h1>
          <p style={{ color: "#4a7fa5", fontSize: ".88rem" }}>{deals.length} total deals</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={openAdd}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 24px", borderRadius: 10, background: "linear-gradient(135deg,#00b4d8,#0077b6)", color: "#fff", fontWeight: 700, border: "none", boxShadow: "0 4px 16px rgba(0,180,216,0.35)", fontSize: ".92rem", cursor: "pointer" }}>
          <Plus size={18} /> Add New Deal
        </motion.button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: 380, marginBottom: 20 }}>
        <Search size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#93b4c8" }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search deals..."
          style={{ ...inp, paddingLeft: 38 }}
          onFocus={e => { e.target.style.borderColor = "#00b4d8"; e.target.style.boxShadow = "0 0 0 3px rgba(0,180,216,0.1)"; }}
          onBlur={e => { e.target.style.borderColor = "#d0eaf8"; e.target.style.boxShadow = "none"; }} />
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 20px rgba(0,100,160,0.09)", border: "1px solid rgba(0,180,216,0.12)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
            <thead>
              <tr style={{ background: "#e8f4fd", borderBottom: "1px solid rgba(0,180,216,0.18)" }}>
                {["DEAL","CATEGORY","PRICE","FEATURED","ACTIVE","ACTIONS"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".08em", color: "#4a7fa5", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#4a7fa5" }}>Loading deals...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#93b4c8" }}>No deals found</td></tr>
              ) : filtered.map((deal, i) => (
                <motion.tr key={deal.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  style={{ borderBottom: "1px solid rgba(0,180,216,0.07)", transition: "background .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f7fbff"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: "1.5rem" }}>{deal.emoji}</span>
                      <div>
                        <div style={{ fontWeight: 700, color: "#023e8a", fontSize: ".88rem", maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{deal.title}</div>
                        <div style={{ fontSize: ".7rem", color: "#93b4c8" }}>{deal.badge || "no badge"}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 50, background: "rgba(0,180,216,0.1)", color: "#0077b6", fontSize: ".73rem", fontWeight: 600 }}>{deal.category || "—"}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontWeight: 700, color: "#023e8a", fontSize: ".88rem" }}>{deal.price}</div>
                    {deal.original && <div style={{ fontSize: ".7rem", color: "#93b4c8", textDecoration: "line-through" }}>{deal.original}</div>}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <button onClick={() => { updateDeal(deal.id, { ...deal, featured: !deal.featured }).then(load); }} style={{ background: "none", border: "none", cursor: "pointer", color: deal.featured ? "#f59e0b" : "#c0d4e0" }}>
                      <Star size={20} fill={deal.featured ? "#f59e0b" : "none"} />
                    </button>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <button onClick={() => { updateDeal(deal.id, { ...deal, active: !deal.active }).then(load); }} style={{ background: "none", border: "none", cursor: "pointer", color: deal.active !== false ? "#10b981" : "#ef4444" }}>
                      {deal.active !== false ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                    </button>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => openEdit(deal)} title="Edit"
                        style={{ padding: "6px 10px", borderRadius: 8, background: "rgba(0,180,216,0.08)", border: "1px solid rgba(0,180,216,0.2)", color: "#0077b6", cursor: "pointer" }}>
                        <Pencil size={14} />
                      </button>
                      <a href={deal.affiliateUrl} target="_blank" rel="noreferrer" title="Open link"
                        style={{ padding: "6px 10px", borderRadius: 8, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", cursor: "pointer", display: "flex", alignItems: "center" }}>
                        <ExternalLink size={14} />
                      </a>
                      <button onClick={() => handleDelete(deal.id)} disabled={deleting === deal.id} title="Delete"
                        style={{ padding: "6px 10px", borderRadius: 8, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", color: "#ef4444", cursor: "pointer" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL ── */}
      {createPortal(
        <AnimatePresence>
        {modal !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeModal}
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(2,30,60,0.45)", zIndex: 9999, backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>

            <motion.div initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.96 }} transition={{ type: "spring", damping: 25, stiffness: 280 }}
              onClick={e => e.stopPropagation()}
              style={{ width: "min(700px, 100%)", maxHeight: "90vh", display: "flex", flexDirection: "column", background: "#fff", borderRadius: 20, boxShadow: "0 32px 80px rgba(0,60,120,0.25)", border: "1px solid rgba(0,180,216,0.15)", overflow: "hidden" }}>

              {/* Modal header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid #e8f4fd", flexShrink: 0, background: "linear-gradient(135deg, #f0f9ff, #e8f4fd)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#00b4d8,#0077b6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                    {form.emoji}
                  </div>
                  <div>
                    <h2 style={{ fontWeight: 900, color: "#023e8a", fontSize: "1.05rem", lineHeight: 1 }}>{modal === "add" ? "Add New Deal" : "Edit Deal"}</h2>
                    <p style={{ fontSize: ".72rem", color: "#4a7fa5", marginTop: 2 }}>{modal === "add" ? "Fill in the details below" : form.title || "Edit deal details"}</p>
                  </div>
                </div>
                <button onClick={closeModal} style={{ background: "rgba(0,180,216,0.1)", border: "1px solid rgba(0,180,216,0.2)", borderRadius: 8, padding: "6px 8px", color: "#4a7fa5", cursor: "pointer", display: "flex" }}>
                  <X size={17} />
                </button>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", borderBottom: "1px solid #e8f4fd", background: "#f7fbff", flexShrink: 0, overflowX: "auto" }}>
                {tabs.map((t) => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    style={{ padding: "11px 20px", border: "none", borderBottom: tab === t.id ? "2px solid #00b4d8" : "2px solid transparent", background: "transparent", color: tab === t.id ? "#0077b6" : "#4a7fa5", fontWeight: tab === t.id ? 700 : 500, fontSize: ".83rem", cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s" }}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab content — scrollable */}
              <form onSubmit={handleSave} style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>

                {/* ── BASIC INFO TAB ── */}
                {tab === "basic" && (
                  <>
                    <Field label="Product Image">
                      <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload}
                        style={{ display: "none" }} />

                      {imgPreview ? (
                        <div style={{ position: "relative", display: "inline-block" }}>
                          <img src={imgPreview} alt="preview"
                            style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 12, border: "2px solid #00b4d8", display: "block" }} />
                          <button type="button" onClick={removeImage}
                            style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: "50%", background: "rgba(239,68,68,0.9)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <X size={14} />
                          </button>
                          <button type="button" onClick={() => fileRef.current?.click()}
                            style={{ position: "absolute", bottom: 8, right: 8, padding: "5px 12px", borderRadius: 8, background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", cursor: "pointer", fontSize: ".75rem", fontWeight: 600 }}>
                            Change
                          </button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                          style={{ width: "100%", padding: "28px 16px", borderRadius: 12, border: "2px dashed #93c5d8", background: "#f0f9ff", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, transition: "all .15s" }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = "#00b4d8"}
                          onMouseLeave={e => e.currentTarget.style.borderColor = "#93c5d8"}>
                          {uploading ? (
                            <>
                              <div style={{ width: 32, height: 32, border: "3px solid #d0eaf8", borderTop: "3px solid #00b4d8", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
                              <span style={{ fontSize: ".85rem", color: "#4a7fa5", fontWeight: 600 }}>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(0,180,216,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Upload size={22} color="#00b4d8" />
                              </div>
                              <div>
                                <div style={{ fontSize: ".9rem", fontWeight: 700, color: "#023e8a" }}>Click to upload image</div>
                                <div style={{ fontSize: ".75rem", color: "#4a7fa5", marginTop: 3 }}>JPG, PNG, WEBP — max 5MB</div>
                              </div>
                            </>
                          )}
                        </button>
                      )}
                      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    </Field>

                    <Field label="Title *">
                      <TextInput value={form.title} onChange={f("title")} placeholder="e.g. Apple AirPods Pro" required />
                    </Field>

                    <Field label="Description">
                      <textarea value={form.desc} onChange={f("desc")} placeholder="Short product description..." rows={3}
                        style={{ ...inp, resize: "vertical" }}
                        onFocus={e => { e.target.style.borderColor = "#00b4d8"; e.target.style.boxShadow = "0 0 0 3px rgba(0,180,216,0.1)"; }}
                        onBlur={e => { e.target.style.borderColor = "#d0eaf8"; e.target.style.boxShadow = "none"; }} />
                    </Field>

                    <Field label="Category *">
                      <select required value={form.category} onChange={f("category")}
                        style={{ ...inp }}
                        onFocus={e => { e.target.style.borderColor = "#00b4d8"; }}
                        onBlur={e => { e.target.style.borderColor = "#d0eaf8"; }}>
                        <option value="">— Select category —</option>
                        {cats.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                      </select>
                    </Field>

                    <Field label="Affiliate URL *">
                      <TextInput type="url" value={form.affiliateUrl} onChange={f("affiliateUrl")} placeholder="https://your-affiliate-link.com" required />
                    </Field>
                  </>
                )}

                {/* ── PRICING TAB ── */}
                {tab === "pricing" && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      <Field label="Sale Price *">
                        <TextInput value={form.price} onChange={f("price")} placeholder="$99.00" required />
                      </Field>
                      <Field label="Original Price">
                        <TextInput value={form.original || ""} onChange={f("original")} placeholder="$149.00" />
                      </Field>
                      <Field label="Discount Label">
                        <TextInput value={form.discount || ""} onChange={f("discount")} placeholder="33% OFF" />
                      </Field>
                      <Field label="Badge Text">
                        <TextInput value={form.badge || ""} onChange={f("badge")} placeholder="🔥 HOT" />
                      </Field>
                    </div>

                    <div style={{ padding: 14, background: "#f0f9ff", borderRadius: 12, border: "1px solid #d0eaf8" }}>
                      <p style={{ ...lbl, marginBottom: 8 }}>Preview</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        {form.badge && <span style={{ background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: ".7rem", fontWeight: 700, padding: "3px 9px", borderRadius: 50 }}>{form.badge}</span>}
                        <span style={{ fontSize: "1.15rem", fontWeight: 900, color: "#0077b6" }}>{form.price || "$0"}</span>
                        {form.original && <span style={{ fontSize: ".85rem", color: "#93b4c8", textDecoration: "line-through" }}>{form.original}</span>}
                        {form.discount && <span style={{ background: "rgba(0,200,81,0.12)", color: "#00a040", fontSize: ".75rem", fontWeight: 700, padding: "2px 9px", borderRadius: 50 }}>{form.discount}</span>}
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      <Field label="Rating (1.0 – 5.0)">
                        <input type="number" min={1} max={5} step={0.1} value={form.rating} onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) })}
                          style={inp}
                          onFocus={e => { e.target.style.borderColor = "#00b4d8"; e.target.style.boxShadow = "0 0 0 3px rgba(0,180,216,0.1)"; }}
                          onBlur={e => { e.target.style.borderColor = "#d0eaf8"; e.target.style.boxShadow = "none"; }} />
                      </Field>
                      <Field label="Reviews Count">
                        <input type="number" min={0} value={form.reviews} onChange={(e) => setForm({ ...form, reviews: parseInt(e.target.value) || 0 })}
                          style={inp}
                          onFocus={e => { e.target.style.borderColor = "#00b4d8"; e.target.style.boxShadow = "0 0 0 3px rgba(0,180,216,0.1)"; }}
                          onBlur={e => { e.target.style.borderColor = "#d0eaf8"; e.target.style.boxShadow = "none"; }} />
                      </Field>
                    </div>
                  </>
                )}

                {/* ── DISPLAY TAB ── */}
                {tab === "display" && (
                  <>
                    <Field label="Card Gradient">
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, padding: 14, background: "#f0f9ff", borderRadius: 12, border: "1px solid #d0eaf8" }}>
                        {GRADIENTS.map((g) => (
                          <button key={g.id} type="button" onClick={() => setForm({ ...form, gradient: g.id })}
                            style={{ borderRadius: 12, border: form.gradient === g.id ? "3px solid #023e8a" : "2px solid transparent", padding: 3, background: "transparent", cursor: "pointer", transition: "all .15s" }}>
                            <div style={{ height: 52, borderRadius: 9, background: `linear-gradient(135deg, ${g.a}, ${g.b})`, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }} />
                            <div style={{ fontSize: ".65rem", color: "#4a7fa5", marginTop: 4, fontWeight: 600, textAlign: "center" }}>{g.label}</div>
                          </button>
                        ))}
                      </div>
                    </Field>

                    {/* Preview card */}
                    <Field label="Card Preview">
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <div style={{ width: 200, borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,100,160,0.15)", border: "1px solid rgba(0,180,216,0.15)" }}>
                          <div style={{ height: 100, background: imgPreview ? "#f0f9ff" : `linear-gradient(135deg, ${GRADIENTS.find(g => g.id === form.gradient)?.a || "#06b6d4"}, ${GRADIENTS.find(g => g.id === form.gradient)?.b || "#2563eb"})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", position: "relative", overflow: "hidden" }}>
                            {imgPreview
                              ? <img src={imgPreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              : form.emoji}
                            {form.discount && <span style={{ position: "absolute", top: 6, right: 6, background: "linear-gradient(135deg,#00c851,#00a040)", color: "#fff", fontSize: ".6rem", fontWeight: 700, padding: "2px 7px", borderRadius: 50 }}>{form.discount}</span>}
                            {form.badge && <span style={{ position: "absolute", top: 6, left: 6, background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: ".6rem", fontWeight: 700, padding: "2px 7px", borderRadius: 50 }}>{form.badge}</span>}
                          </div>
                          <div style={{ padding: "10px 12px 12px" }}>
                            <div style={{ fontSize: ".65rem", color: "#00b4d8", fontWeight: 700, textTransform: "uppercase", marginBottom: 3 }}>{form.category || "Category"}</div>
                            <div style={{ fontSize: ".88rem", fontWeight: 800, color: "#023e8a", lineHeight: 1.3, marginBottom: 4 }}>{form.title || "Product Title"}</div>
                            <div style={{ fontWeight: 900, color: "#0077b6", fontSize: "1rem" }}>{form.price || "$0"}</div>
                          </div>
                        </div>
                      </div>
                    </Field>
                  </>
                )}

                {/* ── SETTINGS TAB ── */}
                {tab === "settings" && (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {[
                        { key: "featured", label: "Featured Deal", desc: "Show in Featured Deals section on homepage", icon: "⭐" },
                        { key: "active",   label: "Active / Visible", desc: "Show this deal on the public site", icon: "✅" },
                      ].map(({ key, label, desc, icon }) => (
                        <label key={key}
                          style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${form[key] ? "#00b4d8" : "#d0eaf8"}`, background: form[key] ? "rgba(0,180,216,0.06)" : "#f7fbff", cursor: "pointer", transition: "all .15s" }}>
                          <span style={{ fontSize: "1.4rem" }}>{icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, color: "#023e8a", fontSize: ".9rem" }}>{label}</div>
                            <div style={{ fontSize: ".75rem", color: "#4a7fa5", marginTop: 2 }}>{desc}</div>
                          </div>
                          <div style={{ width: 46, height: 26, borderRadius: 50, background: form[key] ? "#00b4d8" : "#c0d4e0", position: "relative", transition: "background .2s", flexShrink: 0 }}
                            onClick={(e) => { e.preventDefault(); setForm({ ...form, [key]: !form[key] }); }}>
                            <div style={{ position: "absolute", top: 3, left: form[key] ? 23 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "left .2s" }} />
                          </div>
                        </label>
                      ))}
                    </div>

                    <div style={{ padding: 16, background: "#fffbeb", borderRadius: 12, border: "1px solid #fde68a" }}>
                      <p style={{ fontSize: ".8rem", fontWeight: 700, color: "#92400e", marginBottom: 4 }}>⚠️ Affiliate URL</p>
                      <p style={{ fontSize: ".75rem", color: "#78350f" }}>Make sure your affiliate URL is correct. Users will be redirected to this link when they click "Get Deal".</p>
                      {form.affiliateUrl && (
                        <a href={form.affiliateUrl} target="_blank" rel="noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 8, fontSize: ".75rem", color: "#0077b6", fontWeight: 600 }}>
                          <ExternalLink size={12} /> Test link
                        </a>
                      )}
                    </div>
                  </>
                )}

                {/* Footer buttons */}
                <div style={{ display: "flex", gap: 10, justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid #e8f4fd", marginTop: "auto" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    {tabs.map((t, i) => i > 0 && (
                      <button key={t.id} type="button" onClick={() => setTab(tabs[i - 1].id)}
                        style={{ display: tab === t.id ? "block" : "none", padding: "9px 16px", borderRadius: 9, background: "#f0f9ff", border: "1.5px solid #d0eaf8", color: "#4a7fa5", fontWeight: 600, cursor: "pointer", fontSize: ".83rem" }}>
                        ← Back
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button type="button" onClick={closeModal}
                      style={{ padding: "10px 20px", borderRadius: 9, background: "#f0f9ff", border: "1.5px solid #d0eaf8", color: "#4a7fa5", fontWeight: 600, cursor: "pointer", fontSize: ".88rem" }}>
                      Cancel
                    </button>
                    {tab !== "settings" ? (
                      <button type="button" onClick={() => { const idx = tabs.findIndex(t => t.id === tab); if (idx < tabs.length - 1) setTab(tabs[idx + 1].id); }}
                        style={{ padding: "10px 22px", borderRadius: 9, background: "linear-gradient(135deg,#00b4d8,#0077b6)", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", fontSize: ".88rem" }}>
                        Next →
                      </button>
                    ) : (
                      <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} disabled={saving}
                        style={{ padding: "10px 28px", borderRadius: 9, background: "linear-gradient(135deg,#00b4d8,#0077b6)", color: "#fff", fontWeight: 700, border: "none", boxShadow: "0 4px 16px rgba(0,180,216,0.3)", cursor: saving ? "wait" : "pointer", fontSize: ".88rem" }}>
                        {saving ? "Saving..." : modal === "add" ? "✓ Add Deal" : "✓ Save Changes"}
                      </motion.button>
                    )}
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
