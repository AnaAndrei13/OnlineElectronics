import React from "react";

export default function About() {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      paddingBottom: '60px'
    }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '700',
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
        }}>
          About Us
        </h1>
        <p style={{
          fontSize: '1.3rem',
          maxWidth: '700px',
          margin: '0 auto',
          opacity: 0.95,
          lineHeight: '1.6'
        }}>
          Your trusted partner in electronics management
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Mission Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '50px',
          marginTop: '-40px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          marginBottom: '40px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '20px'
            }}>🎯</div>
            <h2 style={{
              fontSize: '2.2rem',
              fontWeight: '700',
              color: '#1a1a1a',
              marginBottom: '15px'
            }}>
              Our Mission
            </h2>
            <p style={{
              fontSize: '1.15rem',
              color: '#666',
              lineHeight: '1.8',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              We provide a simple, efficient, and powerful platform for managing your electronics catalog. 
              Whether you're an administrator organizing inventory or a customer browsing products, 
              our mission is to make the experience seamless and enjoyable.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginBottom: '50px'
        }}>
          {[
            {
              icon: '📦',
              title: 'Product Management',
              description: 'Add, edit, and delete products with ease. Keep your catalog up-to-date with our intuitive interface.'
            },
            {
              icon: '📊',
              title: 'Stock Tracking',
              description: 'Monitor inventory levels in real-time. Get alerts when stock runs low and never miss a sale.'
            },
            {
              icon: '💰',
              title: 'Price Control',
              description: 'Update prices instantly across your entire catalog. Run promotions and manage discounts effortlessly.'
            },
            {
              icon: '🔐',
              title: 'Secure Platform',
              description: 'Your data is protected with industry-standard security measures and encrypted connections.'
            },
            {
              icon: '📱',
              title: 'Responsive Design',
              description: 'Access your dashboard from any device. Our platform works seamlessly on desktop, tablet, and mobile.'
            },
            {
              icon: '⚡',
              title: 'Fast Performance',
              description: 'Lightning-fast load times and smooth interactions ensure you can work efficiently without delays.'
            }
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '35px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{
                fontSize: '3rem',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '12px',
                textAlign: 'center'
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#666',
                lineHeight: '1.6',
                textAlign: 'center'
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '50px',
          marginBottom: '50px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1a1a1a',
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            By The Numbers
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            textAlign: 'center'
          }}>
            {[
              { number: '10,000+', label: 'Products Managed' },
              { number: '500+', label: 'Happy Customers' },
              { number: '99.9%', label: 'Uptime' },
              { number: '24/7', label: 'Support Available' }
            ].map((stat, index) => (
              <div key={index}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: '#667eea',
                  marginBottom: '10px'
                }}>
                  {stat.number}
                </div>
                <div style={{
                  fontSize: '1rem',
                  color: '#666',
                  fontWeight: '500'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '50px',
          marginBottom: '50px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1a1a1a',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            Our Values
          </h2>
          <p style={{
            fontSize: '1.05rem',
            color: '#666',
            lineHeight: '1.8',
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto 40px'
          }}>
            We believe in transparency, innovation, and putting our customers first. 
            Every decision we make is guided by these core principles.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px',
            marginTop: '30px'
          }}>
            {[
              { icon: '💡', title: 'Innovation', desc: 'Constantly improving and adding new features' },
              { icon: '🤝', title: 'Customer First', desc: 'Your success is our top priority' },
              { icon: '🎯', title: 'Simplicity', desc: 'Complex tools made simple and intuitive' },
              { icon: '🚀', title: 'Growth', desc: 'Scaling with your business needs' }
            ].map((value, index) => (
              <div key={index} style={{
                textAlign: 'center',
                padding: '20px'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>
                  {value.icon}
                </div>
                <h4 style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '8px'
                }}>
                  {value.title}
                </h4>
                <p style={{
                  fontSize: '0.9rem',
                  color: '#666',
                  lineHeight: '1.5'
                }}>
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          padding: '60px 40px',
          textAlign: 'center',
          color: 'white',
          boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📧</div>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '15px'
          }}>
            Get In Touch
          </h2>
          <p style={{
            fontSize: '1.15rem',
            marginBottom: '25px',
            opacity: 0.95
          }}>
            Have questions? We're here to help!
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px'
          }}>
            <a
              href="mailto:support@electronics.com"
              style={{
                backgroundColor: 'white',
                color: '#667eea',
                padding: '15px 40px',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              support@electronics.com
            </a>
            <p style={{
              fontSize: '0.95rem',
              opacity: 0.9,
              marginTop: '10px'
            }}>
              Available Monday - Friday, 9AM - 6PM EST
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}