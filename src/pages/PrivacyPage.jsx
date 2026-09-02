import Header from "../components/Header";
import Footer from "../components/Footer";

const sections = [
  {
    title: "Information we collect",
    body: [
      'DealZone ("we", "us", "our") operates this website and posts affiliate content to Pinterest. We keep the data we collect deliberately narrow:',
    ],
    list: [
      "Email address — only if you subscribe to our newsletter, so we can send deal updates.",
      "Usage data — standard log data (IP address, browser type, pages visited) collected automatically via analytics tools.",
      "Cookies — small files used to keep the site working correctly and to understand aggregate traffic patterns.",
    ],
    note: "We do not collect names, phone numbers, or payment details from visitors — DealZone has no public account signup or checkout of its own.",
  },
  {
    title: "How we use it",
    list: [
      "Sending newsletter emails and deal alerts, only to subscribers.",
      "Understanding site traffic so we can improve content and navigation.",
    ],
    note: "We do not sell your personal information to anyone.",
  },
  {
    title: "Affiliate disclosure",
    body: [
      "DealZone earns commissions. We participate in affiliate programs, including the Amazon Associates Program. When you click a product link on our site or on one of our Pinterest pins and make a purchase, we may earn a commission — at no additional cost to you.",
    ],
  },
  {
    title: "Third-party services",
    body: ["We use a small set of third-party services to run DealZone, each governed by its own privacy policy:"],
    list: [
      "Analytics tools — aggregate traffic and usage measurement.",
      "Amazon Associates — affiliate link tracking and commissions.",
      "Pinterest — publishing and distribution of our pins.",
    ],
  },
  {
    title: "Your rights",
    list: [
      "Unsubscribe from our newsletter anytime via the link at the bottom of any email we send.",
      "Request deletion of any data we hold on you by emailing us — see below.",
    ],
  },
  {
    title: "Contact us",
    body: ["Questions about this policy, or a data request? Reach out via the contact link in our footer."],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main style={{ background: "#f4f9fc", minHeight: "70vh" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px 80px" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: ".75rem",
              fontWeight: 700,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "#00b4d8",
              marginBottom: 12,
            }}
          >
            Legal
          </span>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 900, color: "#023e8a", margin: "0 0 12px", lineHeight: 1.15 }}>
            Privacy Policy
          </h1>
          <p style={{ color: "#5a7a94", fontSize: ".95rem", marginBottom: 44 }}>
            Last updated: September 2, 2026 · Effective for this site
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {sections.map((section) => (
              <section
                key={section.title}
                style={{
                  background: "#fff",
                  border: "1px solid #dbeafc",
                  borderRadius: 16,
                  padding: "28px 32px",
                }}
              >
                <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#023e8a", margin: "0 0 14px" }}>
                  {section.title}
                </h2>
                {section.body?.map((para) => (
                  <p key={para} style={{ color: "#3a5872", fontSize: ".92rem", lineHeight: 1.7, margin: "0 0 12px" }}>
                    {para}
                  </p>
                ))}
                {section.list && (
                  <ul style={{ margin: "0 0 12px", padding: 0, listStyle: "none" }}>
                    {section.list.map((item) => (
                      <li
                        key={item}
                        style={{
                          display: "flex",
                          gap: 10,
                          color: "#3a5872",
                          fontSize: ".9rem",
                          lineHeight: 1.65,
                          marginBottom: 8,
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "#00b4d8",
                            marginTop: 8,
                            flexShrink: 0,
                          }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {section.note && (
                  <p
                    style={{
                      color: "#7d95a8",
                      fontSize: ".84rem",
                      borderTop: "1px solid #eef4f9",
                      paddingTop: 12,
                      margin: 0,
                    }}
                  >
                    {section.note}
                  </p>
                )}
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
