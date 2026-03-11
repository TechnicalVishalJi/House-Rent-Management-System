import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar as BSNavbar, Nav, Container, Button } from "react-bootstrap";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <BSNavbar
      expand="lg"
      style={{
        background: "rgba(15,23,42,0.95)",
        borderBottom: "1px solid #334155",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Container>
        <BSNavbar.Brand
          as={Link}
          to="/"
          style={{ fontWeight: 800, fontSize: "1.25rem" }}
        >
          <span
            style={{
              background: "linear-gradient(135deg,#2563eb,#7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            🏠 RentEase
          </span>
        </BSNavbar.Brand>

        <BSNavbar.Toggle
          aria-controls="main-nav"
          style={{ borderColor: "#334155" }}
        />

        <BSNavbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" style={{ color: "#e2e8f0" }}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/properties" style={{ color: "#e2e8f0" }}>
              Properties
            </Nav.Link>
            {user && (user.role === "landlord" || user.role === "admin") && (
              <Nav.Link
                as={Link}
                to="/add-property"
                style={{ color: "#e2e8f0" }}
              >
                Post Property
              </Nav.Link>
            )}
          </Nav>

          <Nav className="align-items-center gap-2">
            {user ? (
              <>
                <Nav.Link
                  as={Link}
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  style={{ color: "#e2e8f0" }}
                >
                  👤 {user.name}
                </Nav.Link>
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" style={{ color: "#e2e8f0" }}>
                  Login
                </Nav.Link>
                <Button
                  size="sm"
                  className="btn-gradient"
                  as={Link}
                  to="/register"
                >
                  Register
                </Button>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
