import React from 'react';
import './IntroSection.css';
import { FaWhatsapp } from 'react-icons/fa';

function IntroSection() {
  return (
    <div className="intro-section">
      <div className="intro-image-container">
        
        <div className="intro-text-overlay">
          <p>
            <strong className="intro-heading">Sri Sai Venkateshwara Rice Traders</strong> is a trusted name in the rice
            trading industry, dedicated to delivering premium-quality rice to households, retailers, and businesses.
            With a commitment to purity, consistency, and customer satisfaction, we specialize in sourcing and
            supplying a wide variety of rice directly from the finest farms. Our legacy is built on years of experience,
            transparent practices, and a passion for offering rice that meets the highest standards of taste and quality.
          </p>
          <a
            href="https://wa.me/918008692727"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-link"
          >
            <FaWhatsapp className="whatsapp-icon" />
            Chat with us on WhatsApp: <strong>08008692727</strong>
          </a>
        </div>
      </div>
    </div>
  );
}

export default IntroSection;
