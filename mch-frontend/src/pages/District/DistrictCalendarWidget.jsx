import React, { useEffect, useState } from "react";
import api from "../../services/api";
import {
  getAppointmentStats,
  transformEventsToAppointments,
} from "../../services/dashboardService";
import AppLoading from "../../components/spinners/AppPageLoading";
import { Row, Col, Card, Table, Badge } from "react-bootstrap";
import moment from "moment";

/**
 * District Dashboard widget for calendar event analytics
 * Shows district-level appointment and event statistics
 */
const DistrictCalendarWidget = () => {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [facilityStats, setFacilityStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDistrictCalendarStats = async () => {
      try {
        const res = await api.get("/events");
        const eventData = Array.isArray(res.data) ? res.data : [];
        setEvents(eventData);

        // Calculate overall stats
        const appointmentStats = getAppointmentStats(eventData);
        setStats(appointmentStats);

        // Group appointments by facility
        const appointments = transformEventsToAppointments(eventData);
        const facilities = new Map();

        appointments.forEach((appt) => {
          const facilityName = appt.facilityName || "Unknown Facility";
          if (!facilities.has(facilityName)) {
            facilities.set(facilityName, {
              name: facilityName,
              total: 0,
              today: 0,
              upcoming: 0,
              overdue: 0,
            });
          }

          const facility = facilities.get(facilityName);
          facility.total++;

          const apptDate = moment(appt.date);
          const now = moment();

          if (apptDate.isSame(now, "day")) {
            facility.today++;
          } else if (apptDate.isAfter(now)) {
            facility.upcoming++;
          } else {
            facility.overdue++;
          }
        });

        setFacilityStats(Array.from(facilities.values()));
      } catch (error) {
        console.error("Failed to fetch district calendar stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistrictCalendarStats();
  }, []);

  if (loading) return <AppLoading loadingText="Loading calendar analytics..." />;

  if (!stats)
    return (
      <div className="alert alert-info mb-4">
        No calendar data available for this district.
      </div>
    );

  return (
    <div className="mt-4">
      <h4 className="mb-4">📊 District Calendar Analytics</h4>

      {/* Stats Row */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="bg-info text-white text-center">
            <Card.Body>
              <div className="fs-3 fw-bold">{stats.today}</div>
              <div className="small">Today's Appointments</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-primary text-white text-center">
            <Card.Body>
              <div className="fs-3 fw-bold">{stats.upcoming}</div>
              <div className="small">Upcoming</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-success text-white text-center">
            <Card.Body>
              <div className="fs-3 fw-bold">{stats.confirmed}</div>
              <div className="small">Confirmed</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-warning text-dark text-center">
            <Card.Body>
              <div className="fs-3 fw-bold">{stats.overdue}</div>
              <div className="small">Overdue</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Facility Performance Table */}
      <Card className="shadow-sm">
        <Card.Header className="bg-light">
          <Card.Title className="mb-0">Facility Performance</Card.Title>
        </Card.Header>
        <Card.Body>
          {facilityStats.length === 0 ? (
            <p className="text-muted mb-0">No facility data available.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead className="table-light">
                <tr>
                  <th>Facility</th>
                  <th className="text-center">Total</th>
                  <th className="text-center">Today</th>
                  <th className="text-center">Upcoming</th>
                  <th className="text-center">Overdue</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {facilityStats.map((facility, idx) => {
                  const performanceRate = facility.total
                    ? Math.round(
                      ((facility.today + facility.upcoming) / facility.total) *
                      100
                    )
                    : 0;

                  const performanceColor =
                    performanceRate >= 80
                      ? "success"
                      : performanceRate >= 60
                        ? "warning"
                        : "danger";

                  return (
                    <tr key={idx}>
                      <td className="fw-bold">{facility.name}</td>
                      <td className="text-center">
                        <Badge bg="secondary">{facility.total}</Badge>
                      </td>
                      <td className="text-center">
                        <Badge bg="info">{facility.today}</Badge>
                      </td>
                      <td className="text-center">
                        <Badge bg="primary">{facility.upcoming}</Badge>
                      </td>
                      <td className="text-center">
                        <Badge bg="danger">{facility.overdue}</Badge>
                      </td>
                      <td className="text-center">
                        <Badge bg={performanceColor}>
                          {performanceRate}%
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default DistrictCalendarWidget;
