export default function AppointmentsList({ appointments }) {
  return (
    <ul className="space-y-2">
      {appointments.map((appt, i) => (
        <li key={i} className="border p-2 rounded">
          <strong>{appt.date}</strong> — {appt.type} at {appt.location}
        </li>
      ))}
    </ul>
  );
}
