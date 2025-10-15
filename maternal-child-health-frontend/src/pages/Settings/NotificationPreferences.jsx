import React, { useState } from 'react';
import { Form, Card, Row, Col } from 'react-bootstrap';

const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState({
    email: true,
    sms: false,
    inApp: true
  });

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setPreferences(prev => ({ ...prev, [name]: checked }));
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-secondary text-white">
        <h5 className="mb-0">Notification Preferences</h5>
      </Card.Header>
      <Card.Body>
        <Form>
          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Check
                type="switch"
                id="email"
                label="Email Notifications"
                name="email"
                checked={preferences.email}
                onChange={handleToggle}
              />
            </Col>
            <Col xs={12} md={6}>
              <Form.Check
                type="switch"
                id="sms"
                label="SMS Notifications"
                name="sms"
                checked={preferences.sms}
                onChange={handleToggle}
              />
            </Col>
            <Col xs={12} md={6}>
              <Form.Check
                type="switch"
                id="inApp"
                label="In-App Notifications"
                name="inApp"
                checked={preferences.inApp}
                onChange={handleToggle}
              />
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default NotificationPreferences;