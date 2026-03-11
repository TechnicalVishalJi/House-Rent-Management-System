import { useState, useEffect } from "react";
import {
  Container,
  Tab,
  Nav,
  Row,
  Col,
  Button,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import api from "../api/axios";
import { toast } from "react-toastify";

const statusColor = {
  pending: "#f59e0b",
  approved: "#10b981",
  rejected: "#ef4444",
  confirmed: "#10b981",
  cancelled: "#ef4444",
};

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pRes, bRes] = await Promise.all([
          api.get("/properties/admin/all"),
          api.get("/bookings/admin/all"),
        ]);
        setProperties(pRes.data);
        setBookings(bRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/properties/admin/${id}/status`, {
        status,
      });
      setProperties(
        properties.map((p) =>
          p._id === id ? { ...p, status: data.property.status } : p,
        ),
      );
      toast.success(`Property ${status}`);
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm("Delete this property permanently?")) return;
    try {
      await api.delete(`/properties/${id}`);
      setProperties(properties.filter((p) => p._id !== id));
      toast.success("Property deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  if (loading)
    return (
      <div className="spinner-overlay">
        <Spinner animation="border" style={{ color: "#2563eb" }} />
      </div>
    );

  const pending = properties.filter((p) => p.status === "pending");
  const approved = properties.filter((p) => p.status === "approved");

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
            Admin <span>Dashboard</span>
          </h1>
          <p style={{ color: "#94a3b8" }}>
            Manage properties and bookings across the platform
          </p>
        </Container>
      </div>

      <Container className="mt-4">
        {/* Stats */}
        <Row className="g-3 mb-4">
          {[
            {
              label: "Total Properties",
              value: properties.length,
              color: "#2563eb",
            },
            {
              label: "Pending Approval",
              value: pending.length,
              color: "#f59e0b",
            },
            { label: "Approved", value: approved.length, color: "#10b981" },
            {
              label: "Total Bookings",
              value: bookings.length,
              color: "#7c3aed",
            },
          ].map((s, i) => (
            <Col key={i} xs={6} md={3}>
              <div className="custom-card p-3 text-center">
                <div
                  style={{ fontSize: "2rem", fontWeight: 800, color: s.color }}
                >
                  {s.value}
                </div>
                <div style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                  {s.label}
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <Tab.Container defaultActiveKey="pending">
          <Nav
            variant="pills"
            className="mb-4"
            style={{ borderBottom: "1px solid #334155", paddingBottom: "1rem" }}
          >
            <Nav.Item>
              <Nav.Link eventKey="pending" style={{ color: "#94a3b8" }}>
                ⏳ Pending ({pending.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="all" style={{ color: "#94a3b8" }}>
                🏠 All Properties
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="bookings" style={{ color: "#94a3b8" }}>
                📅 All Bookings
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            {/* Pending tab */}
            <Tab.Pane eventKey="pending">
              <h5 style={{ color: "#e2e8f0", marginBottom: "1rem" }}>
                Properties Awaiting Approval
              </h5>
              {pending.length === 0 ? (
                <Alert
                  variant="success"
                  style={{
                    background: "#1e293b",
                    border: "1px solid #334155",
                    color: "#94a3b8",
                  }}
                >
                  ✅ No pending properties — all caught up!
                </Alert>
              ) : (
                <Row className="g-3">
                  {pending.map((p) => (
                    <Col key={p._id} md={6} lg={4}>
                      <div className="custom-card p-3">
                        <h6 style={{ color: "#e2e8f0", fontWeight: 700 }}>
                          {p.title}
                        </h6>
                        <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                          📍 {p.location?.city}, {p.location?.state}
                        </p>
                        <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                          👤 {p.owner?.name} · {p.owner?.email}
                        </p>
                        <p style={{ color: "#10b981", fontWeight: 700 }}>
                          ${p.price}/mo · {p.type}
                        </p>
                        <div className="d-flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="success"
                            className="flex-fill"
                            onClick={() => handleStatus(p._id, "approved")}
                          >
                            ✓ Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            className="flex-fill"
                            onClick={() => handleStatus(p._id, "rejected")}
                          >
                            ✗ Reject
                          </Button>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </Tab.Pane>

            {/* All Properties tab */}
            <Tab.Pane eventKey="all">
              <h5 style={{ color: "#e2e8f0", marginBottom: "1rem" }}>
                All Properties
              </h5>
              <Row className="g-3">
                {properties.map((p) => (
                  <Col key={p._id} md={6} lg={4}>
                    <div className="custom-card p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6
                          style={{
                            color: "#e2e8f0",
                            fontWeight: 700,
                            marginBottom: 0,
                          }}
                        >
                          {p.title}
                        </h6>
                        <Badge
                          bg="none"
                          style={{
                            background: statusColor[p.status] || "#64748b",
                            fontSize: "0.65rem",
                            padding: "3px 8px",
                            borderRadius: "5px",
                            textTransform: "capitalize",
                          }}
                        >
                          {p.status}
                        </Badge>
                      </div>
                      <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                        📍 {p.location?.city}
                      </p>
                      <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                        👤 {p.owner?.name}
                      </p>
                      <p
                        style={{
                          color: "#10b981",
                          fontWeight: 700,
                          fontSize: "0.9rem",
                        }}
                      >
                        ${p.price}/mo
                      </p>
                      {p.status === "pending" && (
                        <div className="d-flex gap-2 mb-2">
                          <Button
                            size="sm"
                            variant="success"
                            className="flex-fill"
                            onClick={() => handleStatus(p._id, "approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="warning"
                            className="flex-fill"
                            onClick={() => handleStatus(p._id, "rejected")}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      <Button
                        size="sm"
                        variant="outline-danger"
                        className="w-100"
                        onClick={() => handleDeleteProperty(p._id)}
                      >
                        🗑 Delete
                      </Button>
                    </div>
                  </Col>
                ))}
              </Row>
            </Tab.Pane>

            {/* All Bookings tab */}
            <Tab.Pane eventKey="bookings">
              <h5 style={{ color: "#e2e8f0", marginBottom: "1rem" }}>
                All Bookings
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
                  No bookings yet.
                </Alert>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "separate",
                      borderSpacing: "0 8px",
                      color: "#e2e8f0",
                      fontSize: "0.875rem",
                    }}
                  >
                    <thead>
                      <tr style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                        <th style={{ padding: "8px 12px" }}>Property</th>
                        <th style={{ padding: "8px 12px" }}>Tenant</th>
                        <th style={{ padding: "8px 12px" }}>Dates</th>
                        <th style={{ padding: "8px 12px" }}>Amount</th>
                        <th style={{ padding: "8px 12px" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr
                          key={b._id}
                          style={{ background: "#1e293b", borderRadius: "8px" }}
                        >
                          <td style={{ padding: "12px" }}>
                            {b.property?.title || "N/A"}
                          </td>
                          <td style={{ padding: "12px" }}>{b.tenant?.name}</td>
                          <td style={{ padding: "12px", color: "#94a3b8" }}>
                            {new Date(b.startDate).toLocaleDateString()} →{" "}
                            {new Date(b.endDate).toLocaleDateString()}
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              color: "#10b981",
                              fontWeight: 700,
                            }}
                          >
                            ${b.totalAmount?.toLocaleString()}
                          </td>
                          <td style={{ padding: "12px" }}>
                            <Badge
                              bg="none"
                              style={{
                                background: statusColor[b.status] || "#64748b",
                                padding: "4px 10px",
                                borderRadius: "6px",
                                textTransform: "capitalize",
                              }}
                            >
                              {b.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </div>
  );
};

export default AdminDashboard;
