import { useState } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import { PROPERTY_TYPES, AMENITY_OPTIONS } from "../constants";

const AddProperty = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "apartment",
    address: "",
    city: "",
    state: "",
    price: "",
    bedrooms: 1,
    bathrooms: 1,
    area: "",
    amenities: [],
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleAmenity = (a) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === "amenities") formData.append(key, form[key].join(","));
        else formData.append(key, form[key]);
      });
      images.forEach((img) => formData.append("images", img));

      await api.post("/properties", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Property submitted for admin approval!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit property");
    } finally {
      setLoading(false);
    }
  };

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
            Post a <span>Property</span>
          </h1>
          <p style={{ color: "#94a3b8" }}>
            Fill in the details below. Your listing will be reviewed by an
            admin.
          </p>
        </Container>
      </div>

      <Container className="mt-4" style={{ maxWidth: "800px" }}>
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="custom-card p-4">
          <Form onSubmit={handleSubmit} className="form-dark">
            <h5 style={{ color: "#e2e8f0", marginBottom: "1rem" }}>
              Basic Information
            </h5>
            <Form.Group className="mb-3">
              <Form.Label>Property Title</Form.Label>
              <Form.Control
                name="title"
                placeholder="e.g. Modern 2BHK Apartment in Downtown"
                value={form.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                placeholder="Describe your property..."
                value={form.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row className="g-3 mb-3">
              <Col md={4}>
                <Form.Label>Property Type</Form.Label>
                <Form.Select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  required
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>Bedrooms</Form.Label>
                <Form.Control
                  type="number"
                  name="bedrooms"
                  min={0}
                  value={form.bedrooms}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={4}>
                <Form.Label>Bathrooms</Form.Label>
                <Form.Control
                  type="number"
                  name="bathrooms"
                  min={1}
                  value={form.bathrooms}
                  onChange={handleChange}
                  required
                />
              </Col>
            </Row>

            <Row className="g-3 mb-4">
              <Col md={6}>
                <Form.Label>Monthly Rent ($)</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  placeholder="e.g. 1200"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Label>Area (sq ft)</Form.Label>
                <Form.Control
                  type="number"
                  name="area"
                  placeholder="e.g. 850"
                  value={form.area}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <h5 style={{ color: "#e2e8f0", marginBottom: "1rem" }}>Location</h5>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                name="address"
                placeholder="Street address"
                value={form.address}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Row className="g-3 mb-4">
              <Col md={6}>
                <Form.Label>City</Form.Label>
                <Form.Control
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Label>State</Form.Label>
                <Form.Control
                  name="state"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                  required
                />
              </Col>
            </Row>

            <h5 style={{ color: "#e2e8f0", marginBottom: "1rem" }}>
              Amenities
            </h5>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {AMENITY_OPTIONS.map((a) => (
                <Button
                  key={a}
                  type="button"
                  size="sm"
                  variant={
                    form.amenities.includes(a) ? "primary" : "outline-secondary"
                  }
                  onClick={() => toggleAmenity(a)}
                  style={{ borderRadius: "20px" }}
                >
                  {form.amenities.includes(a) ? "✓ " : ""}
                  {a}
                </Button>
              ))}
            </div>

            <h5 style={{ color: "#e2e8f0", marginBottom: "1rem" }}>
              Images (up to 5)
            </h5>
            <Form.Group className="mb-4">
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setImages(Array.from(e.target.files).slice(0, 5))
                }
              />
              <Form.Text style={{ color: "#94a3b8" }}>
                Upload up to 5 images
              </Form.Text>
            </Form.Group>

            <Button
              type="submit"
              className="btn-gradient w-100 py-2"
              disabled={loading}
            >
              {loading ? (
                <Spinner size="sm" animation="border" />
              ) : (
                "Submit Property for Approval"
              )}
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default AddProperty;
