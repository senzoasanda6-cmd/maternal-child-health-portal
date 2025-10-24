const SimpleLineChart = ({ data = [], height = 80 }) => {
    const max = Math.max(...data, 1);
    const step = data.length > 1 ? 100 / (data.length - 1) : 100;
    const points = data
        .map((v, i) => `${i * step},${height - (v / max) * height}`)
        .join(" ");

    return (
        <svg viewBox={`0 0 100 ${height}`} width="100%" height={height} aria-label="Line Chart">
            <polyline
                fill="none"
                stroke="#1cc88a"
                strokeWidth="1.5"
                points={points}
            />
        </svg>
    );
};

export default SimpleLineChart;

