import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "tenant",
    phone: "",
  });
  const [error, setError] = useState("");
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    const result = await register(
      form.name,
      form.email,
      form.password,
      form.role,
      form.phone,
    );
    if (result.success) {
      toast.success("Account created successfully!");
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        padding: "40px 0",
        background: "#0f172a",
      }}
    >
      <Container className="d-flex justify-content-center">
        <div className="auth-card" style={{ maxWidth: "520px" }}>
          <div className="text-center mb-4">
            <div style={{ fontSize: "3rem" }}>🏠</div>
            <h2 style={{ fontWeight: 800, color: "#e2e8f0" }}>
              Create Account
            </h2>
            <p style={{ color: "#94a3b8" }}>
              Join thousands of renters and landlords
            </p>
          </div>

          {error && (
            <Alert variant="danger" className="py-2">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit} className="form-dark">
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    placeholder="+1 555 000 1234"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mt-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>I am a...</Form.Label>
              <Form.Select
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="tenant">Tenant (Looking to rent)</option>
                <option value="landlord">
                  Landlord (Want to list property)
                </option>
              </Form.Select>
            </Form.Group>

            <Row className="g-3 mt-1">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Repeat password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button
              type="submit"
              className="btn-gradient w-100 py-2 mt-4"
              disabled={loading}
            >
              {loading ? (
                <Spinner size="sm" animation="border" />
              ) : (
                "Create Account"
              )}
            </Button>
          </Form>

          <p
            className="text-center mt-4"
            style={{ color: "#94a3b8", fontSize: "0.875rem" }}
          >
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#2563eb", fontWeight: 600 }}>
              Sign in here
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Register;
