import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function GrowthChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="height" stroke="#8884d8" />
        <Line type="monotone" dataKey="weight" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}
