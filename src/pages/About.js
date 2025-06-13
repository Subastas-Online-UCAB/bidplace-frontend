import React from 'react';
import { Container, Row, Col, Card, Carousel } from 'react-bootstrap';

const teamMembers = [
  {
    name: 'John Doe',
    position: 'CEO',
    image: 'https://via.placeholder.com/150',
    bio: 'John has over 20 years of experience in the real estate industry and leads the company with a vision for excellence.'
  },
  {
    name: 'Jane Smith',
    position: 'COO',
    image: 'https://via.placeholder.com/150',
    bio: 'Jane oversees all operational aspects of the business, ensuring everything runs smoothly and efficiently.'
  },
  {
    name: 'Sam Wilson',
    position: 'CFO',
    image: 'https://via.placeholder.com/150',
    bio: 'Sam manages the financial actions of the company, focusing on profitability and growth.'
  }
];

const testimonials = [
  {
    name: 'Emily Brown',
    feedback: 'The team at Real Estate were incredibly helpful and professional. They helped us find our dream home!',
    image: 'https://via.placeholder.com/150'
  },
  {
    name: 'Michael Johnson',
    feedback: 'A wonderful experience from start to finish. Highly recommend their services!',
    image: 'https://via.placeholder.com/150'
  }
];

const About = () => (
  <Container className="my-5">
    <Row className="mb-4">
      <Col>
        <h1>About Us</h1>
        <p>
          Welcome to Real Estate, your trusted partner in finding the perfect home. With over two decades of experience, we have been helping people find their dream homes with ease and confidence.
        </p>
      </Col>
    </Row>

    <Row className="mb-4">
      <Col>
        <h2>Our History</h2>
        <p>
          Established in 2000, Real Estate has grown from a small local agency to a nationally recognized company. Our commitment to excellence and customer satisfaction has been the cornerstone of our success.
        </p>
      </Col>
    </Row>

    <Row className="mb-4">
      <Col>
        <h2>Mission and Vision</h2>
        <p>
          <strong>Mission:</strong> To provide exceptional real estate services with integrity, professionalism, and respect for our clients and the community.
        </p>
        <p>
          <strong>Vision:</strong> To be the leading real estate company known for transforming lives through outstanding service and a dedication to excellence.
        </p>
      </Col>
    </Row>

    <Row className="mb-4">
      <Col>
        <h2>Meet Our Team</h2>
        <Row>
          {teamMembers.map(member => (
            <Col key={member.name} sm={12} md={4} className="mb-4">
              <Card>
                <Card.Img variant="top" src={member.image} />
                <Card.Body>
                  <Card.Title>{member.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{member.position}</Card.Subtitle>
                  <Card.Text>{member.bio}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>

    <Row className="mb-4">
      <Col>
        <h2>Testimonials</h2>
        <Carousel>
          {testimonials.map((testimonial, index) => (
            <Carousel.Item key={index}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Img variant="top" src={testimonial.image} className="rounded-circle w-25 mb-3" />
                  <Card.Text className="blockquote mb-0">
                    "{testimonial.feedback}"
                  </Card.Text>
                  <footer className="blockquote-footer mt-2">{testimonial.name}</footer>
                </Card.Body>
              </Card>
            </Carousel.Item>
          ))}
        </Carousel>
      </Col>
    </Row>
  </Container>
);

export default About;