const growthColor = {
  Normal: 'bg-green-100 text-green-800',
  Watch: 'bg-yellow-100 text-yellow-800',
  Concern: 'bg-red-100 text-red-800',
};

export default function ChildCard({ name, age, gender, nextCheckup, growthStatus }) {
  return (
    <div className="p-4 border rounded shadow-sm">
      <h2 className="text-lg font-semibold">{name}</h2>
      <p>Age: {age}</p>
      <p>Gender: {gender}</p>
      <p>Next Checkup: {nextCheckup}</p>
      <span className={`px-2 py-1 rounded ${growthColor[growthStatus]}`}>
        📈 {growthStatus}
      </span>
    </div>
  );
}
