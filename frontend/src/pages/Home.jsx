import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    icon: "🔍",
    title: "Browse Properties",
    desc: "Search thousands of verified rental listings by location, price, and type.",
  },
  {
    icon: "🏡",
    title: "Post Listings",
    desc: "Landlords can post properties and manage inquiries in one place.",
  },
  {
    icon: "📅",
    title: "Easy Booking",
    desc: "Book your perfect home with a simple form and instant confirmation.",
  },
  {
    icon: "🔒",
    title: "Secure & Trusted",
    desc: "JWT auth, encrypted passwords, and admin-moderated listings keep you safe.",
  },
];

const stats = [
  { value: "1,200+", label: "Properties Listed" },
  { value: "800+", label: "Happy Tenants" },
  { value: "350+", label: "Verified Landlords" },
  { value: "98%", label: "Satisfaction Rate" },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <>
      {/* Hero */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={7} className="mb-5 mb-lg-0">
              <p
                className="mb-2"
                style={{
                  color: "#7c3aed",
                  fontWeight: 600,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                }}
              >
                #1 House Rent Platform
              </p>
              <h1 className="hero-title text-white mb-4">
                Find Your <span>Perfect Home</span> with Confidence
              </h1>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "1.1rem",
                  lineHeight: 1.7,
                  maxWidth: "520px",
                }}
              >
                Browse hundreds of verified rental properties, connect with
                trusted landlords, and book your new home — all in one place.
              </p>
              <div className="d-flex gap-3 mt-4 flex-wrap">
                <Button
                  as={Link}
                  to="/properties"
                  className="btn-gradient px-4 py-2"
                  size="lg"
                >
                  Browse Properties →
                </Button>
                {!user && (
                  <Button
                    as={Link}
                    to="/register"
                    variant="outline-light"
                    className="px-4 py-2"
                    size="lg"
                  >
                    Get Started Free
                  </Button>
                )}
                {user &&
                  (user.role === "landlord" || user.role === "admin") && (
                    <Button
                      as={Link}
                      to="/add-property"
                      variant="outline-light"
                      className="px-4 py-2"
                      size="lg"
                    >
                      + Post Property
                    </Button>
                  )}
              </div>
            </Col>
            <Col lg={5} className="d-none d-lg-flex justify-content-center">
              <div
                style={{
                  width: "360px",
                  height: "360px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, rgba(37,99,235,0.2), rgba(124,58,237,0.2))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10rem",
                  border: "2px solid rgba(37,99,235,0.3)",
                }}
              >
                🏠
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats */}
      <section
        style={{
          background: "#1e293b",
          padding: "40px 0",
          borderBottom: "1px solid #334155",
        }}
      >
        <Container>
          <Row className="text-center g-4">
            {stats.map((s, i) => (
              <Col key={i} xs={6} md={3}>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.875rem",
                    marginTop: "4px",
                  }}
                >
                  {s.label}
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 0", background: "#0f172a" }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">
              Why Choose <span>RentEase?</span>
            </h2>
            <p style={{ color: "#94a3b8" }}>
              Everything you need to rent or list a property
            </p>
          </div>
          <Row className="g-4">
            {features.map((f, i) => (
              <Col key={i} md={6} lg={3}>
                <div className="custom-card h-100 p-4 text-center">
                  <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
                    {f.icon}
                  </div>
                  <h5 style={{ color: "#e2e8f0", fontWeight: 700 }}>
                    {f.title}
                  </h5>
                  <p
                    style={{
                      color: "#94a3b8",
                      fontSize: "0.875rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {f.desc}
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "80px 0",
          background: "linear-gradient(135deg, #1e1b4b, #1e293b)",
        }}
      >
        <Container className="text-center">
          <h2 className="section-title mb-3">
            Ready to <span>Get Started?</span>
          </h2>
          <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
            Join thousands of landlords and tenants already using RentEase
          </p>
          {!user && (
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Button
                as={Link}
                to="/register"
                className="btn-gradient px-5 py-2"
                size="lg"
              >
                Create Free Account
              </Button>
              <Button
                as={Link}
                to="/properties"
                variant="outline-light"
                className="px-5 py-2"
                size="lg"
              >
                Browse Properties
              </Button>
            </div>
          )}
          {user && (
            <Button
              as={Link}
              to="/properties"
              className="btn-gradient px-5 py-2"
              size="lg"
            >
              Browse Properties →
            </Button>
          )}
        </Container>
      </section>
    </>
  );
};

export default Home;
