const SimpleBarChart = ({ data = [], height = 120, subText = "" }) => {
    const max = data.length ? Math.max(...data.map((d) => d.value)) : 1;
    const barWidth = Math.floor(100 / Math.max(data.length, 1));

    return (
        <svg
            viewBox={`0 0 100 ${height}`}
            width="100%"
            height={height}
            aria-label="Bar Chart"
        >
            {data.map((d, i) => {
                const h = (d.value / max) * (height - 20);
                return (
                    <g
                        key={i}
                        transform={`translate(${i * barWidth + 2}, ${
                            height - h - 10
                        })`}
                    >
                        <rect
                            width={barWidth - 4}
                            height={h}
                            fill="#4e73df"
                            rx="2"
                        />
                        <text
                            x={(barWidth - 4) / 2}
                            y={h + 12}
                            fontSize="3"
                            fill="#333"
                            textAnchor="middle"
                        >
                            {d.label}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};

export default SimpleBarChart;
