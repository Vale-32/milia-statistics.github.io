// Whole-script strict mode syntax
"use strict";


// Calculates a single trajectory based on the desired mode (score, cumulated, relative, normalized, random)
export function calculateTrajectory(random, mode, p) {
    let trajectory = [];
    let values = [];
    let sum = 0;

    for (let i = 0; i < random.length; i++) {
        if (random[i] < p) {
            values.push(-1); // Penetration
        } else {
            values.push(1);
        }
    }

    for (let i = 0; i < values.length; i++) {
        if (mode == 0) // mode = score
        {
            sum += values[i];
            trajectory.push({ X: i + 1, Y: sum });
        }
        else if (mode == 1) // mode = cumulated
        {
            if (values[i] == 1)
            {
                sum++;
            }
            trajectory.push({ X: i + 1, Y: sum });
        }
        else if (mode == 2) // mode = relative
        {
            if (values[i] == 1)
            {
                sum++;
            }
            trajectory.push({ X: i + 1, Y: sum/(i+1) });
        }
        else if (mode == 3) // mode = normalized
        {
            if (values[i] == 1)
            {
                sum++;
            }
            trajectory.push({ X: i + 1, Y: sum/Math.sqrt(i+1) });
        }
        else if (mode == 4) // mode = random
        {
            sum += random[i];
            trajectory.push({ X: i + 1, Y: sum });
        }      
    }
    return trajectory;
}

// Generate an array of N random values
export function generateRandom(N) {
    let random = [];

    for (let i = 0; i < N; i++) {
        random[i] = Math.random(); // Generate a random value between 0 and 1
    }
    return random;
}

// Frequency array to be used by BarChart
export function countFrequency(trajectoryValues, intervals, minValue, maxValue) {
    
    let frequency = new Array(intervals).fill(0);

    let intervalSize = (maxValue - minValue) / intervals;

    for (let i = 0; i < trajectoryValues.length; i++) {
        let interval = Math.floor((trajectoryValues[i] - minValue) / intervalSize);
        let index = 0;

        if (interval == frequency.length)
        {
            interval--;
        }
        
        index = interval;
        
        
        frequency[index]++;
    }
    return frequency;
}

// Generate M number of trajectories
export function generateNumberOfTrajectories(M, N, p){
    let trajectories_score = [];
    let trajectories_abs = [];
    let trajectories_rel = [];
    let trajectories_norm = [];
    let trajectories_varPoverM = [];
    let trajectories_varPoverNandM = [];
    let trajectories = [];

    // For every M calculate all modes
    for (let i = 0; i < M; i++) {
        let randomValues = generateRandom(N);
        trajectories_score[i] = calculateTrajectory(randomValues, 0, p);
        trajectories_abs[i] = calculateTrajectory(randomValues, 1, p);
        trajectories_rel[i] = calculateTrajectory(randomValues, 2, p);  
        trajectories_norm[i] = calculateTrajectory(randomValues, 3, p);
        trajectories_varPoverM[i] = calculateTrajectory(new Array(randomValues.length).fill(randomValues[0]), 4, p);  
        trajectories_varPoverNandM[i] = calculateTrajectory(randomValues, 4, p);

    }
    trajectories[0] = trajectories_score;
    trajectories[1] = trajectories_abs;
    trajectories[2] = trajectories_rel;
    trajectories[3] = trajectories_norm;
    trajectories[4] = trajectories_varPoverM;
    trajectories[5] = trajectories_varPoverNandM;
    return trajectories;
}

// Test function to observe the output
function calculation() {
    let N = 100; // Number of attacks
    let M = 10; // Number of systems
    let p = 0.5; // Probability of penetration
    let intervals = 5; // Number of intervals in each direction
    let trajectoryEndValues = [];

    for (let i = 0; i < M; i++) {
        let randomValues = generateRandom(N, p);
        let trajectory = calculateTrajectory(randomValues, 1);
        console.log(`${trajectory[N - 1].X} - ${trajectory[N - 1].Y}`);
        trajectoryEndValues.push(trajectory[N - 1].Y);
    }

    const minValue = 0;
    const maxValue = N;
    let frequency = countFrequency(trajectoryEndValues, intervals, minValue, maxValue);
    


    let intervalSize = (maxValue - minValue) / intervals;
    console.log("Frequency Array:");
    for (let i = 0; i < frequency.length; i++) {
        let lowerBound = i * intervalSize + minValue;
        let upperBound = (i + 1) * intervalSize + minValue;
        if (i == frequency.length - 1)
        {
            console.log(`Interval [${lowerBound.toFixed(2)}, ${upperBound.toFixed(2)}]: ${frequency[i]}`);
        }
        else 
        {
            console.log(`Interval [${lowerBound.toFixed(2)}, ${upperBound.toFixed(2)}): ${frequency[i]}`);
        }       
    }
}

calculation();