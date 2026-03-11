import { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../api/axios";
import PropertyCard from "../components/PropertyCard";

const propertyTypes = ["apartment", "house", "studio", "villa", "room"];

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    city: "",
    type: "",
    minPrice: "",
    maxPrice: "",
  });

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.city) params.city = filters.city;
      if (filters.type) params.type = filters.type;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const { data } = await api.get("/properties", { params });
      setProperties(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const handleReset = () => {
    setFilters({ search: "", city: "", type: "", minPrice: "", maxPrice: "" });
    setTimeout(fetchProperties, 100);
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        background: "#0f172a",
        paddingBottom: "60px",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg,#1e293b,#1e1b4b)",
          padding: "50px 0 30px",
          borderBottom: "1px solid #334155",
        }}
      >
        <Container>
          <h1 className="section-title mb-1">
            Available <span>Properties</span>
          </h1>
          <p style={{ color: "#94a3b8" }}>Find your next rental home</p>
        </Container>
      </div>

      <Container className="mt-4">
        {/* Search & Filter */}
        <div className="custom-card p-4 mb-4">
          <Form onSubmit={handleSearch} className="form-dark">
            <Row className="g-3 align-items-end">
              <Col md={3}>
                <Form.Label>Search</Form.Label>
                <Form.Control
                  placeholder="Title, city..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </Col>
              <Col md={2}>
                <Form.Label>City</Form.Label>
                <Form.Control
                  placeholder="e.g. New York"
                  value={filters.city}
                  onChange={(e) =>
                    setFilters({ ...filters, city: e.target.value })
                  }
                />
              </Col>
              <Col md={2}>
                <Form.Label>Type</Form.Label>
                <Form.Select
                  value={filters.type}
                  onChange={(e) =>
                    setFilters({ ...filters, type: e.target.value })
                  }
                >
                  <option value="">All Types</option>
                  {propertyTypes.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Label>Min Price ($)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, minPrice: e.target.value })
                  }
                />
              </Col>
              <Col md={2}>
                <Form.Label>Max Price ($)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="10000"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: e.target.value })
                  }
                />
              </Col>
              <Col md={1} className="d-flex gap-2">
                <Button type="submit" className="btn-gradient w-100">
                  🔍
                </Button>
              </Col>
            </Row>
            <div className="mt-2">
              <Button
                variant="link"
                onClick={handleReset}
                style={{ color: "#94a3b8", fontSize: "0.8rem", padding: 0 }}
              >
                Reset filters
              </Button>
            </div>
          </Form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="spinner-overlay">
            <Spinner animation="border" style={{ color: "#2563eb" }} />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: "4rem" }}>🏚️</div>
            <h4 style={{ color: "#94a3b8", marginTop: "1rem" }}>
              No properties found
            </h4>
            <p style={{ color: "#64748b" }}>
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "0.875rem",
                marginBottom: "1rem",
              }}
            >
              Showing{" "}
              <strong style={{ color: "#e2e8f0" }}>{properties.length}</strong>{" "}
              properties
            </p>
            <Row className="g-4">
              {properties.map((property) => (
                <Col key={property._id} sm={6} lg={4} xl={3}>
                  <PropertyCard property={property} />
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default Properties;
