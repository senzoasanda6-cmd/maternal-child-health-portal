export default function QuickLinks({ links }) {
  return (
    <ul className="grid grid-cols-2 gap-4">
      {links.map((r, i) => (
        <li key={i}>
          <a href={r.url} className="text-blue-600 underline">
            {r.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
