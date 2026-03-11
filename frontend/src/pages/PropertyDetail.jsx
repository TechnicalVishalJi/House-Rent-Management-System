import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Spinner,
  Form,
  Modal,
  Alert,
} from "react-bootstrap";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { SERVER_URL } from "../constants";

const PropertyDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [booking, setBooking] = useState({
    startDate: "",
    endDate: "",
    message: "",
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/properties/${id}`);
        setProperty(data);
      } catch (err) {
        navigate("/properties");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    setBookingLoading(true);
    try {
      await api.post("/bookings", { propertyId: id, ...booking });
      toast.success("Booking request sent!");
      setShowModal(false);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading)
    return (
      <div className="spinner-overlay">
        <Spinner animation="border" style={{ color: "#2563eb" }} />
      </div>
    );
  if (!property) return null;

  const placeholder =
    "https://via.placeholder.com/800x400/1e293b/94a3b8?text=No+Image";

  return (
    <div
      style={{
        background: "#0f172a",
        minHeight: "80vh",
        paddingBottom: "60px",
      }}
    >
      <Container className="py-5">
        <Row className="g-5">
          {/* Left - Images & Details */}
          <Col lg={8}>
            <img
              src={
                property.images?.length > 0
                  ? `${SERVER_URL}${property.images[0]}`
                  : placeholder
              }
              alt={property.title}
              style={{
                width: "100%",
                height: "380px",
                objectFit: "cover",
                borderRadius: "16px",
              }}
            />
            {property.images?.length > 1 && (
              <Row className="g-2 mt-2">
                {property.images.slice(1, 4).map((img, i) => (
                  <Col xs={4} key={i}>
                    <img
                      src={`${SERVER_URL}${img}`}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  </Col>
                ))}
              </Row>
            )}

            <div className="mt-4">
              <h2 style={{ color: "#e2e8f0", fontWeight: 800 }}>
                {property.title}
              </h2>
              <p style={{ color: "#94a3b8" }}>
                📍 {property.location?.address}, {property.location?.city},{" "}
                {property.location?.state}
              </p>

              <div className="d-flex gap-3 flex-wrap my-3">
                <span
                  style={{
                    background: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    padding: "6px 14px",
                    color: "#e2e8f0",
                    fontSize: "0.875rem",
                  }}
                >
                  🛏 {property.bedrooms} Bedrooms
                </span>
                <span
                  style={{
                    background: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    padding: "6px 14px",
                    color: "#e2e8f0",
                    fontSize: "0.875rem",
                  }}
                >
                  🚿 {property.bathrooms} Bathrooms
                </span>
                {property.area && (
                  <span
                    style={{
                      background: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      padding: "6px 14px",
                      color: "#e2e8f0",
                      fontSize: "0.875rem",
                    }}
                  >
                    📐 {property.area} sq ft
                  </span>
                )}
                <Badge
                  bg="none"
                  style={{
                    background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    textTransform: "capitalize",
                  }}
                >
                  {property.type}
                </Badge>
              </div>

              <h5 style={{ color: "#e2e8f0", marginTop: "1.5rem" }}>
                Description
              </h5>
              <p style={{ color: "#94a3b8", lineHeight: 1.8 }}>
                {property.description}
              </p>

              {property.amenities?.length > 0 && (
                <>
                  <h5 style={{ color: "#e2e8f0", marginTop: "1.5rem" }}>
                    Amenities
                  </h5>
                  <div className="d-flex flex-wrap gap-2">
                    {property.amenities.map((a, i) => (
                      <span
                        key={i}
                        style={{
                          background: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "6px",
                          padding: "4px 12px",
                          color: "#94a3b8",
                          fontSize: "0.8rem",
                        }}
                      >
                        ✓ {a}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Col>

          {/* Right - Booking Card */}
          <Col lg={4}>
            <div className="custom-card p-4 sticky-top" style={{ top: "80px" }}>
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  color: "#10b981",
                }}
              >
                ${property.price?.toLocaleString()}
                <span
                  style={{
                    fontSize: "1rem",
                    color: "#94a3b8",
                    fontWeight: 400,
                  }}
                >
                  /month
                </span>
              </div>
              <hr style={{ borderColor: "#334155" }} />

              {property.owner && (
                <div className="mb-3">
                  <p
                    style={{
                      color: "#94a3b8",
                      fontSize: "0.8rem",
                      marginBottom: "4px",
                    }}
                  >
                    Listed by
                  </p>
                  <p style={{ color: "#e2e8f0", fontWeight: 600 }}>
                    {property.owner.name}
                  </p>
                  <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                    📧 {property.owner.email}
                  </p>
                  {property.owner.phone && (
                    <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                      📞 {property.owner.phone}
                    </p>
                  )}
                </div>
              )}

              {property.isAvailable ? (
                <Button
                  className="btn-gradient w-100 py-2"
                  onClick={() => {
                    if (!user) navigate("/login");
                    else setShowModal(true);
                  }}
                >
                  {user ? "📅 Book Now" : "🔑 Login to Book"}
                </Button>
              ) : (
                <Alert variant="warning" className="text-center">
                  This property is not available
                </Alert>
              )}

              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.75rem",
                  textAlign: "center",
                  marginTop: "12px",
                }}
              >
                No commitment until booking is confirmed
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Booking Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header
          closeButton
          style={{ background: "#1e293b", border: "1px solid #334155" }}
        >
          <Modal.Title style={{ color: "#e2e8f0" }}>Book Property</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: "#1e293b" }}>
          <Form onSubmit={handleBook} className="form-dark">
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={booking.startDate}
                    onChange={(e) =>
                      setBooking({ ...booking, startDate: e.target.value })
                    }
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={booking.endDate}
                    onChange={(e) =>
                      setBooking({ ...booking, endDate: e.target.value })
                    }
                    required
                    min={booking.startDate}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mt-3">
              <Form.Label>Message (optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Any message for the landlord..."
                value={booking.message}
                onChange={(e) =>
                  setBooking({ ...booking, message: e.target.value })
                }
              />
            </Form.Group>
            <Button
              type="submit"
              className="btn-gradient w-100 py-2 mt-3"
              disabled={bookingLoading}
            >
              {bookingLoading ? (
                <Spinner size="sm" animation="border" />
              ) : (
                "Confirm Booking Request"
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PropertyDetail;
