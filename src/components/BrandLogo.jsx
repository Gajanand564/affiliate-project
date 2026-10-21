export default function BrandLogo({ width = 54, style = {} }) {
  return (
    <img src="/brand/dz-logo-108.png" alt="DealZone DZ logo" width={width}
      height={width} decoding="async"
      style={{ display: "block", flexShrink: 0, objectFit: "contain", background: "#fff", borderRadius: 8, padding: 3, ...style }} />
  );
}
