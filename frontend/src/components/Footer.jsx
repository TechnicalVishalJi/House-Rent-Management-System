import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="mb-3">
          <Col md={4} className="mb-3 mb-md-0">
            <h5 style={{ fontWeight: 700, color: "#e2e8f0" }}>
              <span
                style={{
                  background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                🏠 RentEase
              </span>
            </h5>
            <p className="mt-2" style={{ fontSize: "0.875rem" }}>
              Connecting landlords and tenants seamlessly.
            </p>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <h6 style={{ color: "#e2e8f0", fontWeight: 600 }}>Quick Links</h6>
            <ul className="list-unstyled mt-2" style={{ fontSize: "0.875rem" }}>
              <li>
                <Link
                  to="/"
                  style={{ color: "#94a3b8", textDecoration: "none" }}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/properties"
                  style={{ color: "#94a3b8", textDecoration: "none" }}
                >
                  Properties
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  style={{ color: "#94a3b8", textDecoration: "none" }}
                >
                  Register
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h6 style={{ color: "#e2e8f0", fontWeight: 600 }}>Contact</h6>
            <ul
              className="list-unstyled mt-2"
              style={{ fontSize: "0.875rem", color: "#94a3b8" }}
            >
              <li>📧 support@rentease.com</li>
              <li>📞 +1 (555) 000-1234</li>
            </ul>
          </Col>
        </Row>
        <hr style={{ borderColor: "#334155" }} />
        <p className="mb-0" style={{ fontSize: "0.875rem" }}>
          © {new Date().getFullYear()} RentEase. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
