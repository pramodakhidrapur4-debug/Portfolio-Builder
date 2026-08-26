import React, { useEffect, useState } from "react";
import { getPreviousWorks } from "../api";
import "./OurPrevWork.css";

const OurPrevWork = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWorks = async () => {
    try {
      setError("");
      const res = await getPreviousWorks();
      setWorks(res.data.data || res.data); // Support { data: [...] } or direct array
    } catch (err) {
      console.error("Error fetching works:", err);
      setError("Unable to load previous works. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  if (loading) {
    return (
      <section className="opw">
        <div className="opw-loading">
          <div className="opw-spinner"></div>
          <p>Loading projects...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="opw">
        <div className="opw-error">
          <p>⚠️ {error}</p>
          <button onClick={fetchWorks}>Retry</button>
        </div>
      </section>
    );
  }

  return (
    <section className="opw">
      <div className="opw-container">
        <div className="opw-heading">
          <span>OUR WORK</span>
          <h1>Our Previous Works</h1>
          <p>Take a look at some of the websites we have built for businesses.</p>
        </div>

        <div className="works">
          {works.length === 0 ? (
            <p className="no-work">No previous works available.</p>
          ) : (
            works.map((work) => (
              <div className="work-card" key={work._id}>
                {/* Project Image */}
                <div className="work-image">
                  <img
                    src={work.image}
                    alt={work.businessName}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/600x400?text=Image+Not+Found";
                    }}
                  />
                </div>

                {/* Project Details */}
                <div className="work-content">
                  <h2>{work.businessName}</h2>
                  <p>{work.description}</p>

                  {/* Website Link */}
                  {work.link && (
                    <a
                      href={work.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="work-link"
                    >
                      View Website
                      <span>↗</span>
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default OurPrevWork;