import SimpleBarChart from "../../components/charts/SimpleBarChart";
import SimpleLineChart from "../../components/charts/SimpleLineChart";
import SimplePieChart from "../../components/charts/SimplePieChart";

const ChartCard = ({ title, delta, subText, visualHeight, type }) => (
    // <div className="card text-center h-100 p-3">
    //     <div className="card-body d-flex flex-column justify-content-center align-items-center">
    //         <h3 className="card-text">{value}</h3>
    //         {delta !== undefined && (
    //             <small className="text-muted">{delta}</small>
    //         )}
    //         <h6 className="card-title text-muted">{title}</h6>
    //     </div>
    // </div>
    <div className="card p-3 h-100">
        <h6>{title}</h6>
        <div className="h-100 w-100">
            {/* if define a chart based on the type prop, valid values are "line", "bar", "pie" */}
            {type === "bar" && (
                <SimpleBarChart
                    data={delta}
                    height={visualHeight || 200}
                    subText={subText}
                />
            )}
            {type === "line" && (
                <SimpleLineChart
                    data={delta}
                    height={visualHeight || 200}
                    subText={subText}
                />
            )}
            {type === "pie" && (
                <SimplePieChart
                    data={delta}
                    height={visualHeight || 200}
                    subText={subText}
                />
            )}
        </div>
    </div>
);

export default ChartCard;
