import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => (
  <Card style={{ width: '18rem' }}>
    <Card.Img variant="top" src={property.image} />
    <Card.Body>
      <Card.Title>{property.title}</Card.Title>
      <Card.Text>
        {property.description}
      </Card.Text>
      <Button as={Link} to={`/properties/${property.id}`} variant="primary">
        More Details
      </Button>
    </Card.Body>
  </Card>
);

export default PropertyCard;