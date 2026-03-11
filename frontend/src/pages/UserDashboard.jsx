import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Spinner,
  Tab,
  Nav,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { STATUS_COLORS } from "../constants";

const UserDashboard = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [listRes, bookRes] = await Promise.all([
          user.role !== "tenant"
            ? api.get("/properties/my/listings")
            : Promise.resolve({ data: [] }),
          api.get("/bookings/my"),
        ]);
        setListings(listRes.data);
        setBookings(bookRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleDeleteListing = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    try {
      await api.delete(`/properties/${id}`);
      setListings(listings.filter((l) => l._id !== id));
      toast.success("Property deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(bookings.filter((b) => b._id !== id));
      toast.success("Booking cancelled");
    } catch (err) {
      toast.error("Failed to cancel");
    }
  };

  if (loading)
    return (
      <div className="spinner-overlay">
        <Spinner animation="border" style={{ color: "#2563eb" }} />
      </div>
    );

  return (
    <div
      style={{
        background: "#0f172a",
        minHeight: "80vh",
        paddingBottom: "60px",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg,#1e293b,#1e1b4b)",
          padding: "40px 0 30px",
          borderBottom: "1px solid #334155",
        }}
      >
        <Container>
          <h1 className="section-title">
            My <span>Dashboard</span>
          </h1>
          <p style={{ color: "#94a3b8" }}>
            Welcome back, {user.name} ·{" "}
            <span
              style={{
                color: "#7c3aed",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {user.role}
            </span>
          </p>
        </Container>
      </div>

      <Container className="mt-4">
        {/* Stats */}
        <Row className="g-3 mb-4">
          {user.role !== "tenant" && (
            <Col sm={6} md={3}>
              <div className="custom-card p-3 text-center">
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#2563eb",
                  }}
                >
                  {listings.length}
                </div>
                <div style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                  My Listings
                </div>
              </div>
            </Col>
          )}
          <Col sm={6} md={3}>
            <div className="custom-card p-3 text-center">
              <div
                style={{ fontSize: "2rem", fontWeight: 800, color: "#7c3aed" }}
              >
                {bookings.length}
              </div>
              <div style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                My Bookings
              </div>
            </div>
          </Col>
          <Col sm={6} md={3}>
            <div className="custom-card p-3 text-center">
              <div
                style={{ fontSize: "2rem", fontWeight: 800, color: "#10b981" }}
              >
                {bookings.filter((b) => b.status === "confirmed").length}
              </div>
              <div style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                Confirmed
              </div>
            </div>
          </Col>
        </Row>

        <Tab.Container
          defaultActiveKey={user.role !== "tenant" ? "listings" : "bookings"}
        >
          <Nav
            variant="pills"
            className="mb-4"
            style={{ borderBottom: "1px solid #334155", paddingBottom: "1rem" }}
          >
            {user.role !== "tenant" && (
              <Nav.Item>
                <Nav.Link eventKey="listings" style={{ color: "#94a3b8" }}>
                  🏠 My Listings
                </Nav.Link>
              </Nav.Item>
            )}
            <Nav.Item>
              <Nav.Link eventKey="bookings" style={{ color: "#94a3b8" }}>
                📅 My Bookings
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            {/* Listings Tab */}
            <Tab.Pane eventKey="listings">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 style={{ color: "#e2e8f0" }}>My Properties</h5>
                <Button
                  as={Link}
                  to="/add-property"
                  className="btn-gradient"
                  size="sm"
                >
                  + Add Property
                </Button>
              </div>
              {listings.length === 0 ? (
                <Alert
                  variant="secondary"
                  style={{
                    background: "#1e293b",
                    border: "1px solid #334155",
                    color: "#94a3b8",
                  }}
                >
                  No listings yet.{" "}
                  <Link to="/add-property" style={{ color: "#2563eb" }}>
                    Post your first property
                  </Link>
                </Alert>
              ) : (
                <Row className="g-3">
                  {listings.map((p) => (
                    <Col key={p._id} md={6} lg={4}>
                      <div className="custom-card p-3">
                        <h6 style={{ color: "#e2e8f0", fontWeight: 700 }}>
                          {p.title}
                        </h6>
                        <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                          📍 {p.location?.city}
                        </p>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span style={{ color: "#10b981", fontWeight: 700 }}>
                            ${p.price}/mo
                          </span>
                          <Badge
                            bg="none"
                            style={{
                              background: STATUS_COLORS[p.status] || "#64748b",
                              fontSize: "0.7rem",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              textTransform: "capitalize",
                            }}
                          >
                            {p.status}
                          </Badge>
                        </div>
                        <div className="d-flex gap-2">
                          <Button
                            as={Link}
                            to={`/properties/${p._id}`}
                            size="sm"
                            variant="outline-primary"
                            className="flex-fill"
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            className="flex-fill"
                            onClick={() => handleDeleteListing(p._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </Tab.Pane>

            {/* Bookings Tab */}
            <Tab.Pane eventKey="bookings">
              <h5 style={{ color: "#e2e8f0", marginBottom: "1rem" }}>
                My Bookings
              </h5>
              {bookings.length === 0 ? (
                <Alert
                  variant="secondary"
                  style={{
                    background: "#1e293b",
                    border: "1px solid #334155",
                    color: "#94a3b8",
                  }}
                >
                  No bookings yet.{" "}
                  <Link to="/properties" style={{ color: "#2563eb" }}>
                    Browse properties
                  </Link>
                </Alert>
              ) : (
                <Row className="g-3">
                  {bookings.map((b) => (
                    <Col key={b._id} md={6} lg={4}>
                      <div className="custom-card p-3">
                        <h6 style={{ color: "#e2e8f0", fontWeight: 700 }}>
                          {b.property?.title}
                        </h6>
                        <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                          📍 {b.property?.location?.city}
                        </p>
                        <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                          📅 {new Date(b.startDate).toLocaleDateString()} →{" "}
                          {new Date(b.endDate).toLocaleDateString()}
                        </p>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span style={{ color: "#10b981", fontWeight: 700 }}>
                            ${b.totalAmount?.toLocaleString()}
                          </span>
                          <Badge
                            bg="none"
                            style={{
                              background: STATUS_COLORS[b.status] || "#64748b",
                              fontSize: "0.7rem",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              textTransform: "capitalize",
                            }}
                          >
                            {b.status}
                          </Badge>
                        </div>
                        {b.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline-danger"
                            className="w-100"
                            onClick={() => handleCancelBooking(b._id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </div>
  );
};

export default UserDashboard;
