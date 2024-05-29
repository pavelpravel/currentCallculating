import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Graph = ({ graph }) => {
    const { a, b, c, Frab, Ftorm, Ftorm_,frab_ } = graph;

    // Calculate quadratic function points
    const dataPoints = [];
    for (let x = 0; x <= 300; x += 30) {
        dataPoints.push({ x, y: a * x * x + b * x + c });
    }

	// Calculate line
    const linePoints = [
        { x: 0, y: 0 },
        { x: Frab, y: Ftorm },
    ];

	// intersection point coordinates
	let intersectionPoint = {x: Ftorm_, y: frab_}


    const data = {
        datasets: [
            {
                label: "Quadratic Function",
                data: dataPoints,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                showLine: true,
                borderWidth: 2,
                pointRadius: 0,
            },
            {
                label: "Line from (0, 0) to (Frab, Ftorm)",
                data: linePoints,
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                showLine: true,
                borderWidth: 2,
                pointRadius: 3,
            },
            {
                label: "Intersection Point",
                data: intersectionPoint ? [intersectionPoint] : [],
				//data: intersectionPoint1,
                borderColor: "rgba(255, 206, 86, 1)",
                backgroundColor: "rgba(255, 206, 86, 1)",
                pointRadius: 5,
                showLine: false,
            },
            // Dashed line to the x-axis
            {
                label: "Dashed Line to X-axis",
                data: intersectionPoint
                    ? [{ x: intersectionPoint.x, y: 0 }, intersectionPoint]
                    : [],
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                borderDash: [5, 5],
                fill: false,
                showLine: true,
                pointRadius: 0,
            },
            // Dashed line to the y-axis
            {
                label: "Dashed Line to Y-axis",
                data: intersectionPoint
                    ? [{ x: 0, y: intersectionPoint.y }, intersectionPoint]
                    : [],
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                borderDash: [5, 5],
                fill: false,
                showLine: true,
                pointRadius: 0,
            },
            // Dashed line from (0, Ftorm) to (Frab, Ftorm)
            {
                label: "Dashed Line to X-axis",
                data: [
                    { x: 0, y: Ftorm },
                    { x: Frab, y: Ftorm },
                ],
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                borderDash: [5, 5],
                fill: false,
                showLine: true,
                pointRadius: 0,
            },
            // Dashed line from (Frab, 0) to (Frab, Ftorm)
            {
                label: "Dashed Line to Y-axis",
                data: [
                    { x: Frab, y: 0 },
                    { x: Frab, y: Ftorm },
                ],
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                borderDash: [5, 5],
                fill: false,
                showLine: true,
                pointRadius: 0,
            },
        ],
    };

    const options = {
        scales: {
            x: {
                type: "linear",
                position: "bottom",
            },
        },
    };
    return <Line data={data} options={options} />;
};

export default Graph;
