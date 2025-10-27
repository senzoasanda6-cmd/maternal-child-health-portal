const StatCard = ({ title, value, delta }) => (
    <div className="card text-center h-100 p-3">
        <div className="card-body d-flex flex-column justify-content-center align-items-center">
            <h3 className="card-text">{value}</h3>
            {delta !== undefined && (
                <small className="text-muted">{delta}</small>
            )}
            <h6 className="card-title text-muted">{title}</h6>
        </div>
    </div>
);

export default StatCard;
