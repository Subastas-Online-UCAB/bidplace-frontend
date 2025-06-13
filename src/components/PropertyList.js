import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PropertyCard from './PropertyCard';
import properties from '../data/properties';

const PropertyList = () => (
  <Container>
    <Row>
      {properties.map(property => (
        <Col key={property.id} sm={12} md={6} lg={4}>
          <PropertyCard property={property} />
        </Col>
      ))}
    </Row>
  </Container>
);

export default PropertyList;