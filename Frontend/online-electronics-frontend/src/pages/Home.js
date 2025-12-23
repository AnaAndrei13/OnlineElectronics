import "../css/Home.css";
import { FaBolt, FaTruck, FaShieldAlt, FaHeadset } from 'react-icons/fa';

export default function Home() {
  return (
    
      <main className="home-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <FaBolt /> Coming Soon
            </div>
            <h1 className="hero-title">
              Your Electronics Store
              <span className="hero-highlight"> Is Loading</span>
            </h1>
            <p className="hero-description">
              We work hard to bring you the best electronic products. 
              Sign up to get notified when we launch!
            </p>
          </div>
          <div className="hero-decoration">
            <div className="decoration-circle circle-1"></div>
            <div className="decoration-circle circle-2"></div>
            <div className="decoration-circle circle-3"></div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaBolt />
              </div>
              <h3>Premium Products</h3>
              <p>Next-generation electronics, handpicked with care</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaTruck />
              </div>
             <h3>Fast Delivery</h3>
             <p>Free shipping for orders over 200 RON</p>

            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <h3>Extended Warranty</h3>
              <p>Comprehensive protection for your products</p>

            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaHeadset />
              </div>
              <h3>24/7 Support</h3>
              <p>Our team is always available</p>

            </div>
          </div>
        </section>

        {/* Coming Soon Products */}
        <section className="featured-products">
          <h2>Our Products</h2>
          <p className="section-subtitle">Coming soon: a wide range of electronic products</p>
          <div className="products-grid">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="product-card-placeholder">
                <div className="product-image-placeholder">
                  <FaBolt className="placeholder-icon" />
                  <span>Soon</span>
                </div>
                <div className="product-info-placeholder">
                  <div className="placeholder-line long"></div>
                  <div className="placeholder-line short"></div>
                  <div className="placeholder-line medium"></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="newsletter-section">
          <div className="newsletter-content">
            <h2>Be the First to Know!</h2>
            <p>Subscribe to our newsletter for exclusive offers and the latest updates</p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="your email"
                className="newsletter-input"
              />
              <button className="newsletter-button">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
   
  );
}
