import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import properties from '../data/properties'; // Aquí puede estar el backend con la data de propiedades
import './Home.css';

// Imágenes del slider principal
import img1 from './img/1.png';
import img2 from './img/2.png';
import img3 from './img/3.png';

// Imágenes de colecciones destacadas
import arteImg from './img/arte.jpg';
import comicsImg from './img/comics.jpg';
import vehiculoImg from './img/vehiculo.jpg';

// Imágenes de testimonios
import testimonio1 from './img/testimonio1.jpg';
import testimonio2 from './img/testimonio2.jpg';
import testimonio3 from './img/testimonio3.jpg';

const images = [img1, img2, img3];

// Testimonios estáticos, el backend podría proporcionar estos datos
const testimonios = [
  {
    name: 'Marcos Perez',
    feedback: 'Gané una pintura clásica a un precio increíble. ¡Bidplace es mi nuevo lugar favorito para coleccionar arte!',
    image: testimonio1,
  },
  {
    name: 'Aquita Sato',
    feedback: 'Subasté una figura de acción antigua y se vendió en menos de 24 horas. ¡Gran alcance!',
    image: testimonio2,
  },
  {
    name: 'Steve',
    feedback: 'Nunca imaginé conseguir una reliquia de colección tan única. ¡Estoy fascinado con la plataforma!',
    image: testimonio3,
  },
];

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(true);

  

  // Se debe integrar el backend aquí para obtener imágenes dinámicas en lugar de las locales
  useEffect(() => {
      const url = window.location.href;

  const hasRefreshed = sessionStorage.getItem('hasRefreshed');
  const isRoot = url.endsWith('/') || url.endsWith('/#') || url.endsWith('/#/');

  if (isRoot && !hasRefreshed) {
    sessionStorage.setItem('hasRefreshed', 'true');
    window.location.href = window.location.origin + '/#/home';
    return;
  }

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="hero-section bg-white">
        <Container className="d-flex align-items-center justify-content-center flex-wrap hero-content">
          <div className="hero-text text-center text-dark">
            <h1 className="static-title">¡Bienvenido a Bidplace!</h1>
          </div>
          <div className="image-slider-floating right">
            <img
              src={images[currentImage]} // Debería ser un dato proveniente del backend
              alt="destacado"
              className={`slider-image-floating ${fade ? 'fade-in' : 'fade-out'} floating`}
            />
          </div>
        </Container>
      </div>

      <Container className="my-5">
        <Row className="text-center mb-4">
          <Col>
            <h2>¡Haz tu jugada y reclama tu premio!</h2>
          </Col>
        </Row>

        {/* Colecciones destacadas */}
        <Row className="section-spacing2">
          <Col>
            <h3 className="mb-4">Colecciones destacadas</h3>
            <Row>
              {/* Aquí es necesario integrar el backend para obtener las colecciones dinámicamente */}
              <Col sm={12} md={6} lg={4} className="mb-4">
                <Card className="property-card">
                  <Card.Img variant="top" src={arteImg} className="collection-image" /> {/* La imagen puede venir del backend */}
                  <Card.Body>
                    <Card.Title>Arte y antigüedades</Card.Title>
                    <Card.Text>
                      Memorabilia exclusiva y piezas únicas que despiertan la nostalgia de generaciones enteras.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={12} md={6} lg={4} className="mb-4">
                <Card className="property-card">
                  <Card.Img variant="top" src={comicsImg} className="collection-image" /> {/* Imagen dinámica desde el backend */}
                  <Card.Body>
                    <Card.Title>Coleccionables</Card.Title>
                    <Card.Text>
                      Piezas que no se encuentran fácilmente en el mercado. Comic vintage, objetos históricos y autógrafos de autores célebres.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={12} md={6} lg={4} className="mb-4">
                <Card className="property-card">
                  <Card.Img variant="top" src={vehiculoImg} className="collection-image" /> {/* Imagen dinámica desde el backend */}
                  <Card.Body>
                    <Card.Title>Vehículos</Card.Title>
                    <Card.Text>
                      Desde autos clásicos que evocan nostalgia hasta modelos de lujo y ediciones limitadas que definen elegancia.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Testimonios / Ganadores */}
        <Row className="section-spacing">
          <Col>
            <h3 className="mb-4">Ganadores</h3>
            <Carousel>
              {/* Los testimonios pueden ser cargados desde el backend */}
              {testimonios.map((testimonial, index) => (
                <Carousel.Item key={index}>
                  <Card className="text-center">
                    <Card.Body>
                      <Card.Img variant="top" src={testimonial.image} className="testimonial-img mb-3" />
                      <Card.Text className="blockquote mb-0">
                        "{testimonial.feedback}" {/* Los testimonios pueden venir del backend */}
                      </Card.Text>
                      <footer className="blockquote-footer mt-2">{testimonial.name}</footer>
                    </Card.Body>
                  </Card>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>

        {/* ¿Por qué Bidplace? */}
        <Row className="section-spacing">
          <Col>
            <h3 className="mb-4">¿Por qué Bidplace?</h3>
            <Row>
              {/* Información de la sección '¿Por qué Bidplace?' también puede ser dinámica */}
              <Col md={4} className="mb-4">
                <Card className="text-center">
                  <Card.Body>
                    <Card.Title>Comunidad en crecimiento</Card.Title>
                    <Card.Text>
                      Oportunidades de colaboración, acceso a nuevas ideas y tendencias, y la posibilidad de destacarte en un entorno dinámico.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className="text-center">
                  <Card.Body>
                    <Card.Title>Oportunidad para subastar mejor</Card.Title>
                    <Card.Text>
                      Permite acceder a una audiencia amplia y diversa. Lo que incrementa las posibilidades de venta.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className="text-center">
                  <Card.Body>
                    <Card.Title>Siempre notificado</Card.Title>
                    <Card.Text>
                      Ofrecemos ventaja competitiva, permitiéndote tomar decisiones rápidas.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
