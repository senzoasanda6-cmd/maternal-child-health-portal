import React, { useEffect, useState } from "react";
import api from "../../services/api"; // Adjust path if needed

const AdminRescheduleDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/admin/reschedule-requests");
      setBookings(res.data);
    } catch (error) {
      console.error("Failed to fetch reschedule requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveReschedule = async (id) => {
    try {
      await api.patch(`/admin/bookings/${id}/approve-reschedule`);
      alert("Reschedule approved.");
      fetchBookings(); // refresh list
    } catch (error) {
      console.error("Approval failed:", error);
      alert("Something went wrong.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <p className="text-center py-5">Loading requests...</p>;

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Pending Reschedule Requests</h2>
      {bookings.length === 0 ? (
        <p className="text-center">No pending requests.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Current Date</th>
                <th>New Date</th>
                <th>New Time</th>
                <th>Location</th>
                <th>Reason</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.fullName}</td>
                  <td>{booking.preferredDate}</td>
                  <td>{booking.preferredDate}</td>
                  <td>{booking.preferredTime}</td>
                  <td>{booking.location}</td>
                  <td>{booking.reschedule_reason}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => approveReschedule(booking.id)}
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminRescheduleDashboard;
