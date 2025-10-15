import React from 'react';
import AccountSettings from './AccountSettings';
import NotificationPreferences from './NotificationPreferences';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Settings = () => {
  return (
    <Container className="my-5">
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <h2 className="mb-0 text-center text-primary">User Settings</h2>
        </Card.Body>
      </Card>

      <Row>
        <Col lg={6} className="mb-4">
          <AccountSettings />
        </Col>
        <Col lg={6}>
          <NotificationPreferences />
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;