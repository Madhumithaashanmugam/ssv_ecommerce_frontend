import React from 'react';
import './Footer.css';
import { FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <FaMapMarkerAlt className="footer-icon" />
          <p>
            1-7-188/1/1A, Opp. Shiva Temple, <br />
            Besides Srikara Raghavendra Hospital, <br />
            South Kamala Nagar, Kamalanagar, <br />
            Secunderabad, Telangana 500062
          </p>
        </div>

        <div className="footer-section">
          <FaPhoneAlt className="footer-icon" />
          <p>
            Phone: <br />
            <a href="tel:08008692727">08008692727</a>
          </p>
        </div>

        <div className="footer-section">
          <FaWhatsapp className="footer-icon" />
          <p>
            WhatsApp: <br />
            <a
              href="https://wa.me/918008692727"
              target="_blank"
              rel="noopener noreferrer"
            >
              08008692727
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
