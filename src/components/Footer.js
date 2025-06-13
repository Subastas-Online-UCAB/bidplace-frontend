import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <Container>
      <Row className="footer-top">
        <Col md={4} className="footer-left">
          <h5>Contacto</h5>
          <p>Teléfono: +58 000 000 000</p>
          <p>Email: info@bidplace.com</p>
        </Col>
        <Col md={4} />
        <Col md={4} className="footer-right d-flex justify-content-end align-items-start">
          <div>
            <h5>Síguenos</h5>
            <div className="social-icons">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebookF size={24} />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter size={24} />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col className="text-center mt-4">
          <p className="mb-0">&copy; {new Date().getFullYear()} Bidplace. Todos los derechos reservados.</p>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
