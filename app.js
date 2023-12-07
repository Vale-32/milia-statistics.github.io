let currentProcess = "Poisson";

function initializeCharts() {
    let isDraggingChart1 = false;
    let isResizingChart1 = false;
    let lastCursorChart1;
    let lastLocationChart1;

    let isDraggingChart2 = false;
    let isResizingChart2 = false;
    let lastCursorChart2;
    let lastLocationChart2;

    const T = 365; // time period in days (1 year)
    const N = 365; // number of intervals
    const lambda = 50; // average of attacks during the time T

    // Change this variable to switch the display process


    const trajectories1 = generateTrajectory(currentProcess, T, N, lambda);
    const trajectories2 = generateTrajectory("Brownian", T, N);

    const finalValuesAll = []; // Array to store final values for each process

    const finalValues1 = trajectories1.map(data => Math.round(data[N - 1].y));
    const finalValues2 = trajectories2.map(data => Math.round(data[N - 1].y));

    finalValuesAll.push(finalValues1, finalValues2);

    // Generating the histogram data
    const histogramDataPoints = [];
    const frequencyMap = {};
    const dynamicFinalValues = currentProcess === "Poisson" ? finalValuesAll[0] : finalValuesAll[1];

    dynamicFinalValues.forEach(value => {
        frequencyMap[value] = (frequencyMap[value] || 0) + 1;
    });

    // Use values at a specific point in time for each trajectory for chart1
    for (let i = 0; i < N; i++) {
        const valuesAtTimeN = trajectories1.map(data => data[i].y);
        const uniqueValues = Array.from(new Set(valuesAtTimeN));

        uniqueValues.forEach(value => {
            frequencyMap[value] = (frequencyMap[value] || 0) + 1;
        });
    }

    for (const [value, frequency] of Object.entries(frequencyMap)) {
        histogramDataPoints.push({ label: `Value: ${value}`, y: frequency });
    }

    const roundedHistogramDataPoints = [];
    for (const [value, frequency] of Object.entries(frequencyMap)) {
        roundedHistogramDataPoints.push({ label: `Value: ${Math.round(parseFloat(value))}`, y: frequency });
    }

    // Find the minimum and maximum values for scaling the x-axis
    const valuesArray = dynamicFinalValues.map(Number);
    const minAxisValue = currentProcess === "Poisson" ? 0 : Math.min(...valuesArray);
    const maxAxisValue = Math.max(...valuesArray);

    console.log(minAxisValue, maxAxisValue);
    // Chart 1 - Histogram
    const chart1 = new CanvasJS.Chart("chart1", {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: `Histogram of Final Values (Rounded) - ${currentProcess}`
        },
        axisX: {
            title: "Final Values",
            minimum: minAxisValue,
            maximum: maxAxisValue
        },
        axisY: {
            title: "Frequency"
        },
        data: [{
            type: "column",
            dataPoints: roundedHistogramDataPoints
        }]
    });
    chart1.render();

    // Chart 2 - Line Chart
    const chart2 = new CanvasJS.Chart("chart2", {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: `Trajectories of ${currentProcess} Process`
        },
        data: trajectories1.map((data, index) => ({
            type: "line",
            dataPoints: data,
            name: `Trajectory ${index + 1}`
        }))
    });
    chart2.render();

    function generateTrajectory(processType, T, N, lambda) {
        if (processType === "Poisson") {
            const trajectories = new Array(T);
            for (let i = 0; i < T; i++) {
                const binaryValues = generateRandomBinary(N, lambda, i);
                trajectories[i] = [{ x: 1, y: binaryValues[0] }];
                for (let j = 1; j < N; j++) {
                    trajectories[i].push({ x: j + 1, y: trajectories[i][j - 1].y + binaryValues[j] });
                }
            }
            return trajectories;
        } else if (processType === "Brownian") {
            const trajectories = new Array(T);
            for (let i = 0; i < T; i++) {
                trajectories[i] = calculateTrajectory(generateRandomBrownian(N));
            }
            return trajectories;
        } else if (processType === "GeometricBrownian") {
            const trajectories = new Array(T);
            for (let i = 0; i < T; i++) {
                trajectories[i] = calculateTrajectory(generateGeometricBrownian(N));
            }
            return trajectories;
        } else if (processType === "OrnsteinUhlenbeck") {
            const trajectories = new Array(T);
            for (let i = 0; i < T; i++) {
                trajectories[i] = calculateTrajectory(generateOrnsteinUhlenbeck(N));
            }
            return trajectories;
        } else if (processType === "Vasicek") {
            const trajectories = new Array(T);
            for (let i = 0; i < T; i++) {
                trajectories[i] = calculateTrajectory(generateVasicek(N));
            }
            return trajectories;
        } else if (processType === "HullWhite") {
            const trajectories = new Array(T);
            for (let i = 0; i < T; i++) {
                trajectories[i] = calculateTrajectory(generateHullWhite(N));
            }
            return trajectories;
        } else if (processType === "CIR") {
            const trajectories = new Array(T);
            for (let i = 0; i < T; i++) {
                trajectories[i] = calculateTrajectory(generateCIR(N));
            }
            return trajectories;
        } else if (processType === "BlackKarasinski") {
            const trajectories = new Array(T);
            for (let i = 0; i < T; i++) {
                trajectories[i] = calculateTrajectory(generateBlackKarasinski(N));
            }
            return trajectories;
        } else if (processType === "Heston") {
            const trajectories = new Array(T);
            for (let i = 0; i < T; i++) {
                trajectories[i] = calculateTrajectory(generateHeston(N));
            }
            return trajectories;
        } else if (processType === "ChenModel") {
            const trajectories = new Array(T);
            for (let i = 0; i < T; i++) {
                trajectories[i] = calculateTrajectory(generateChenModel(N));
            }
            return trajectories;
        }
        // Add more cases for other stochastic processes as needed
    }

    function generateVasicek(N) {
        const dt = 1 / N;
        const r0 = 0.03;
        const kappa = 0.1;
        const theta = 0.03;
        const sigma = 0.02;
        let r = [r0];

        for (let i = 1; i < N; i++) {
            const dW = Math.sqrt(dt) * (Math.random() - 0.5);
            const dr = kappa * (theta - r[i - 1]) * dt + sigma * dW;
            r.push(r[i - 1] + dr);
        }

        return r;
    }

    function generateHullWhite(N) {
        const dt = 1 / N;
        const r0 = 0.03;
        const kappa = 0.1;
        const sigma = 0.02;
        let r = [r0];

        for (let i = 1; i < N; i++) {
            const dW = Math.sqrt(dt) * (Math.random() - 0.5);
            const dr = kappa * (r0 - r[i - 1]) * dt + sigma * dW;
            r.push(r[i - 1] + dr);
        }

        return r;
    }

    function generateCIR(N) {
        const dt = 1 / N;
        const r0 = 0.03;
        const kappa = 0.1;
        const theta = 0.03;
        const sigma = 0.02;
        let r = [r0];

        for (let i = 1; i < N; i++) {
            const dW = Math.sqrt(dt) * (Math.random() - 0.5);
            const dr = kappa * (theta - r[i - 1]) * dt + sigma * Math.sqrt(r[i - 1]) * dW;
            r.push(Math.max(0, r[i - 1] + dr));
        }

        return r;
    }

    function generateBlackKarasinski(N) {
        const dt = 1 / N;
        const r0 = 0.03;
        const kappa = 0.1;
        const theta = 0.03;
        const sigma = 0.02;
        let r = [r0];

        for (let i = 1; i < N; i++) {
            const dW = Math.sqrt(dt) * (Math.random() - 0.5);
            const dr = kappa * (theta - r[i - 1]) * dt + sigma * Math.sqrt(r[i - 1]) * dW;
            r.push(r[i - 1] + dr);
        }

        return r;
    }

    function generateGeometricBrownian(N) {
        let values = [1];
        for (let i = 1; i < N; i++) {
            let randomIncrement = 0.1 * values[i - 1] + 0.2 * values[i - 1] * (Math.random() - 0.5);
            values.push(values[i - 1] + randomIncrement);
        }
        return values;
    }

    function generateOrnsteinUhlenbeck(N) {
        let values = [0.5];
        for (let i = 1; i < N; i++) {
            let randomIncrement = 0.1 * (0.5 - values[i - 1]) + 0.2 * Math.sqrt(Math.abs(values[i - 1])) * (Math.random() - 0.5);
            values.push(values[i - 1] + randomIncrement);
        }
        return values;
    }

    function generateHeston(N) {
        const dt = 1 / N;
        const v0 = 0.04;
        const kappa = 0.1;
        const theta = 0.04;
        const sigma = 0.3;
        const rho = -0.5;
        let v = [v0];

        for (let i = 1; i < N; i++) {
            const dW1 = Math.sqrt(dt) * (Math.random() - 0.5);
            const dW2 = Math.sqrt(dt) * (Math.random() - 0.5);
            const dv = kappa * (theta - v[i - 1]) * dt + sigma * Math.sqrt(v[i - 1]) * (rho * dW1 + Math.sqrt(1 - rho ** 2) * dW2);
            v.push(Math.max(0, v[i - 1] + dv));
        }

        return v;
    }

    function generateChenModel(N) {
        const dt = 1 / N;
        const r0 = 0.03;
        const alpha = 0.1;
        const beta = 0.5;
        const sigma = 0.02;
        let r = [r0];

        for (let i = 1; i < N; i++) {
            const dW = Math.sqrt(dt) * (Math.random() - 0.5);
            const dr = alpha * (beta - r[i - 1]) * dt + sigma * Math.sqrt(Math.abs(r[i - 1])) * dW;
            r.push(r[i - 1] + dr);
        }

        return r;
    }


    function calculateTrajectory(values) {
        let trajectory = [];
        let sum = 0;
        for (let i = 0; i < values.length; i++) {
            sum += values[i];
            trajectory.push({ x: i + 1, y: sum });
        }
        return trajectory;
    }

    function generateRandomBinary(N, lambda, seed) {
        let random = [];
        for (let i = 0; i < N; i++) {
            let randomValue = Math.random();
            if (randomValue < lambda / N) {
                random.push(1);
            } else {
                random.push(0);
            }
        }
        return random;
    }

    function generateRandomBrownian(N) {
        let values = [0];
        for (let i = 1; i < N; i++) {
            let randomIncrement = (Math.random() - 0.5) * 2; // Random value between -1 and 1
            values.push(values[i - 1] + randomIncrement);
        }
        return values;
    }

    // Event listeners for chart movement and resizing
    const chart1Element = document.getElementById('chart1');
    const chart2Element = document.getElementById('chart2');

    let lastMouseX, lastMouseY;
    let lastWidth, lastHeight;

    chart1Element.addEventListener('mousedown', (e) => {
        if (e.buttons === 1) {
            isDraggingChart1 = true;
            lastCursorChart1 = { x: e.clientX, y: e.clientY };
            lastLocationChart1 = { x: chart1Element.offsetLeft, y: chart1Element.offsetTop };
        } else if (e.buttons === 2) {
            isResizingChart1 = true;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            lastWidth = chart1Element.offsetWidth;
            lastHeight = chart1Element.offsetHeight;
        }
    });

    chart1Element.addEventListener('mousemove', (e) => {
        if (isDraggingChart1) {
            let tempX = lastLocationChart1.x + e.clientX - lastCursorChart1.x;
            let tempY = lastLocationChart1.y + e.clientY - lastCursorChart1.y;
            chart1Element.style.left = tempX + 'px';
            chart1Element.style.top = tempY + 'px';
        } else if (isResizingChart1) {
            let tempWidth = lastWidth + e.clientX - lastMouseX;
            let tempHeight = lastHeight + e.clientY - lastMouseY;
            chart1Element.style.width = tempWidth + 'px';
            chart1Element.style.height = tempHeight + 'px';
            chart1.render();
        }
    });

    chart1Element.addEventListener('mouseup', () => {
        isDraggingChart1 = false;
        isResizingChart1 = false;
    });

    // Event listeners for chart2
    chart2Element.addEventListener('mousedown', (e) => {
        if (e.buttons === 1) {
            isDraggingChart2 = true;
            lastCursorChart2 = { x: e.clientX, y: e.clientY };
            lastLocationChart2 = { x: chart2Element.offsetLeft, y: chart2Element.offsetTop };
        } else if (e.buttons === 2) {
            isResizingChart2 = true;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            lastWidth = chart2Element.offsetWidth;
            lastHeight = chart2Element.offsetHeight;
        }
    });

    chart2Element.addEventListener('mousemove', (e) => {
        if (isDraggingChart2) {
            let tempX = lastLocationChart2.x + e.clientX - lastCursorChart2.x;
            let tempY = lastLocationChart2.y + e.clientY - lastCursorChart2.y;
            chart2Element.style.left = tempX + 'px';
            chart2Element.style.top = tempY + 'px';
        } else if (isResizingChart2) {
            let tempWidth = lastWidth + e.clientX - lastMouseX;
            let tempHeight = lastHeight + e.clientY - lastMouseY;
            chart2Element.style.width = tempWidth + 'px';
            chart2Element.style.height = tempHeight + 'px';
            chart2.render();
        }
    });

    chart2Element.addEventListener('mouseup', () => {
        isDraggingChart2 = false;
        isResizingChart2 = false;
    });

    window.addEventListener('resize', function () {
        chart1.render();
        chart2.render();
    });
}

function changeProcess(processType) {
    currentProcess = processType;
    console.log("Selected process:", currentProcess);

    // Re-initialize charts when the process changes
    initializeCharts();

    // You can do other things with the currentProcess variable here
}

document.addEventListener("DOMContentLoaded", function () {
    initializeCharts();
});

