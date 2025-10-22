const StatCard = ({ title, value, delta }) => (
    <div className="card text-center p-3">
        <div className="card-body">
            <h6 className="card-title text-muted">{title}</h6>
            <h3 className="card-text">{value}</h3>
            {delta !== undefined && (
                <small className="text-muted">{delta}</small>
            )}
        </div>
    </div>
);

export default StatCard;
