import { Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

const PropertyCard = ({ property }) => {
  const placeholder =
    "https://via.placeholder.com/400x200/1e293b/94a3b8?text=No+Image";

  return (
    <div className="custom-card h-100">
      <img
        src={
          property.images && property.images.length > 0
            ? `http://localhost:5000${property.images[0]}`
            : placeholder
        }
        alt={property.title}
        className="property-img"
      />
      <div className="p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 style={{ color: "#e2e8f0", fontWeight: 700, marginBottom: 0 }}>
            {property.title}
          </h6>
          <Badge
            bg="none"
            style={{
              background: "linear-gradient(135deg,#2563eb,#7c3aed)",
              fontSize: "0.7rem",
              borderRadius: "6px",
            }}
          >
            {property.type}
          </Badge>
        </div>
        <p
          style={{ color: "#94a3b8", fontSize: "0.8rem", marginBottom: "8px" }}
        >
          📍 {property.location?.city}, {property.location?.state}
        </p>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span style={{ color: "#10b981", fontWeight: 700, fontSize: "1rem" }}>
            ${property.price?.toLocaleString()}
            <span
              style={{ color: "#94a3b8", fontWeight: 400, fontSize: "0.8rem" }}
            >
              /mo
            </span>
          </span>
          <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
            🛏 {property.bedrooms} · 🚿 {property.bathrooms}
          </span>
        </div>
        <Link
          to={`/properties/${property._id}`}
          className="btn btn-gradient w-100"
          style={{ fontSize: "0.875rem", padding: "8px" }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
