import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(form.email, form.password);
    if (result.success) {
      toast.success("Welcome back!");
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
        background: "#0f172a",
      }}
    >
      <Container className="d-flex justify-content-center">
        <div className="auth-card">
          <div className="text-center mb-4">
            <div style={{ fontSize: "3rem" }}>🔑</div>
            <h2 style={{ fontWeight: 800, color: "#e2e8f0" }}>Welcome Back</h2>
            <p style={{ color: "#94a3b8" }}>Sign in to your account</p>
          </div>

          {error && (
            <Alert variant="danger" className="py-2">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit} className="form-dark">
            <Form.Group className="mb-3">
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

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              className="btn-gradient w-100 py-2"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" animation="border" /> : "Sign In"}
            </Button>
          </Form>

          <p
            className="text-center mt-4"
            style={{ color: "#94a3b8", fontSize: "0.875rem" }}
          >
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#2563eb", fontWeight: 600 }}>
              Register here
            </Link>
          </p>

          {/* Demo credentials hint */}
          <div
            className="mt-3 p-3"
            style={{
              background: "#0f172a",
              borderRadius: "8px",
              border: "1px solid #334155",
            }}
          >
            <p
              className="mb-1"
              style={{
                color: "#94a3b8",
                fontSize: "0.75rem",
                textAlign: "center",
              }}
            >
              <strong style={{ color: "#f59e0b" }}>Demo Admin:</strong>{" "}
              admin@rentease.com / admin123
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;
