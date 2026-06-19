import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getCategories, createCategory, updateCategory, deleteCategory, uploadImage, IMG_BASE } from "../services/api";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";

const EMOJIS = ["💻","🎮","👗","💊","🏠","✈️","📚","🍔","📱","🎒","⌚","🧹","🎧","👟","🖥️","📖","☕","💪","🧳","🌐"];
const S = { input: { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid rgba(0,180,216,0.25)", background: "#f0f9ff", color: "#023e8a", fontSize: ".9rem", outline: "none" }, label: { fontSize: ".78rem", fontWeight: 600, color: "#4a7fa5", display: "block", marginBottom: 5 } };

export default function CategoriesManager() {
  const [cats, setCats]         = useState([]);
  const [modal, setModal]       = useState(null);
  const [form, setForm]         = useState({ name: "", icon: "💻", image: "" });
  const [saving, setSaving]     = useState(false);
  const [loading, setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imgPreview, setImgPreview] = useState(null);
  const fileRef = useRef();

  const load = () => { setLoading(true); getCategories().then(setCats).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openAdd  = () => { setForm({ name: "", icon: "💻", image: "" }); setImgPreview(null); setModal("add"); };
  const openEdit = (c) => { setForm({ name: c.name, icon: c.icon || "💻", image: c.image || "" }); setImgPreview(c.image ? IMG_BASE + c.image : null); setModal(c); };

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
    e.preventDefault(); setSaving(true);
    try {
      if (modal === "add") await createCategory(form);
      else await updateCategory(modal.id, form);
      load(); setModal(null);
    } catch {} finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    await deleteCategory(id); load();
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 14 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#023e8a" }}>Categories</h1>
          <p style={{ color: "#4a7fa5", fontSize: ".88rem" }}>{cats.length} categories</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={openAdd}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 10, background: "linear-gradient(135deg,#00b4d8,#0077b6)", color: "#fff", fontWeight: 700, border: "none", boxShadow: "0 4px 16px rgba(0,180,216,0.35)", fontSize: ".92rem", cursor: "pointer" }}>
          <Plus size={18} /> Add Category
        </motion.button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#4a7fa5" }}>Loading...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16 }}>
          {cats.map((cat, i) => (
            <motion.div key={cat.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
              style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 18px rgba(0,100,160,0.09)", border: "1px solid rgba(0,180,216,0.12)", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              {/* Image or emoji */}
              <div style={{ width: "100%", height: 100, background: cat.image ? "#f0f9ff" : "linear-gradient(135deg,#e0f4fd,#cceeff)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                {cat.image ? (
                  <img src={IMG_BASE + cat.image} alt={cat.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                ) : null}
                <div style={{ display: cat.image ? "none" : "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", position: cat.image ? "absolute" : "relative", inset: 0 }}>
                  <span style={{ fontSize: "2.5rem" }}>{cat.icon}</span>
                </div>
              </div>
              <div style={{ padding: "12px 16px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", boxSizing: "border-box" }}>
                <span style={{ fontWeight: 700, color: "#023e8a", fontSize: ".95rem" }}>{cat.name}</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => openEdit(cat)}
                    style={{ padding: "6px 10px", borderRadius: 8, background: "rgba(0,180,216,0.1)", border: "1px solid rgba(0,180,216,0.2)", color: "#0077b6", cursor: "pointer" }}>
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)}
                    style={{ padding: "6px 10px", borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", cursor: "pointer" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {createPortal(
        <AnimatePresence>
        {modal !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setModal(null)}
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,30,60,0.4)", zIndex: 9999, backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
            <motion.div initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }}
              onClick={e => e.stopPropagation()}
              style={{ width: "min(480px,100%)", maxHeight: "90vh", overflowY: "auto", background: "#fff", borderRadius: 20, boxShadow: "0 24px 64px rgba(0,100,160,0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid rgba(0,180,216,0.12)", background: "linear-gradient(135deg,#f0f9ff,#e8f4fd)", borderRadius: "20px 20px 0 0", position: "sticky", top: 0, zIndex: 1 }}>
                <h2 style={{ fontWeight: 900, color: "#023e8a", fontSize: "1.05rem" }}>{modal === "add" ? "Add Category" : "Edit Category"}</h2>
                <button onClick={() => setModal(null)} style={{ background: "rgba(0,180,216,0.1)", border: "1px solid rgba(0,180,216,0.2)", borderRadius: 8, padding: "6px 8px", color: "#4a7fa5", cursor: "pointer", display: "flex" }}><X size={17} /></button>
              </div>
              <form onSubmit={handleSave} style={{ padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Image upload */}
                <div>
                  <label style={S.label}>Category Image</label>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                  {imgPreview ? (
                    <div style={{ position: "relative" }}>
                      <img src={imgPreview} alt="preview"
                        style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 12, border: "2px solid #00b4d8", display: "block" }} />
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
                      style={{ width: "100%", padding: "22px 16px", borderRadius: 12, border: "2px dashed #93c5d8", background: "#f0f9ff", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "#00b4d8"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "#93c5d8"}>
                      {uploading ? (
                        <>
                          <div style={{ width: 28, height: 28, border: "3px solid #d0eaf8", borderTop: "3px solid #00b4d8", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
                          <span style={{ fontSize: ".83rem", color: "#4a7fa5", fontWeight: 600 }}>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(0,180,216,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Upload size={20} color="#00b4d8" />
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: ".87rem", fontWeight: 700, color: "#023e8a" }}>Click to upload image</div>
                            <div style={{ fontSize: ".72rem", color: "#4a7fa5", marginTop: 2 }}>JPG, PNG, WEBP — max 5MB</div>
                          </div>
                        </>
                      )}
                    </button>
                  )}
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </div>

                {/* Name */}
                <div>
                  <label style={S.label}>Name *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Category name" style={S.input}
                    onFocus={e => e.target.style.borderColor = "#00b4d8"} onBlur={e => e.target.style.borderColor = "rgba(0,180,216,0.25)"} />
                </div>

                {/* Emoji fallback */}
                <div>
                  <label style={S.label}>Emoji (fallback if no image)</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: 10, background: "#f0f9ff", borderRadius: 10, border: "1px solid #d0eaf8" }}>
                    {EMOJIS.map((em) => (
                      <button key={em} type="button" onClick={() => setForm({ ...form, icon: em })}
                        style={{ width: 42, height: 42, borderRadius: 10, border: form.icon === em ? "2.5px solid #00b4d8" : "1.5px solid #d0eaf8", background: form.icon === em ? "rgba(0,180,216,0.12)" : "#fff", fontSize: "1.3rem", cursor: "pointer", transform: form.icon === em ? "scale(1.12)" : "scale(1)", transition: "all .12s" }}>
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => setModal(null)}
                    style={{ padding: "9px 20px", borderRadius: 10, background: "#f0f9ff", border: "1.5px solid #d0eaf8", color: "#4a7fa5", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                  <button type="submit" disabled={saving}
                    style={{ padding: "9px 24px", borderRadius: 10, background: "linear-gradient(135deg,#00b4d8,#0077b6)", color: "#fff", fontWeight: 700, border: "none", cursor: saving ? "wait" : "pointer", boxShadow: "0 4px 14px rgba(0,180,216,0.3)" }}>
                    {saving ? "Saving..." : modal === "add" ? "✓ Add" : "✓ Save"}
                  </button>
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
