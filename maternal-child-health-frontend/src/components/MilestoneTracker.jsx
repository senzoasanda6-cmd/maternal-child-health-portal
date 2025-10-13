export default function MilestoneTracker({ milestones }) {
  return (
    <ul className="space-y-1">
      {milestones.map((m, i) => (
        <li key={i}>
          {m.status} {m.label}
        </li>
      ))}
    </ul>
  );
}
