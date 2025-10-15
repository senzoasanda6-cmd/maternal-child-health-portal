export default function HealthRecords({ records }) {
  return (
    <div className="space-y-2">
      {records.map((record, i) => (
        <div key={i} className="border p-2 rounded">
          <h4 className="font-semibold">{record.title}</h4>
          <p>{record.details}</p>
        </div>
      ))}
    </div>
  );
}
