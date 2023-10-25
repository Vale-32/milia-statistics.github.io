using System;
using System.Collections.Generic;

public class TrajectoryCalculator
{
    public class Point
    {
        public int X { get; set; }
        public double Y { get; set; }
    }

    // Calculates a single trajectory based on the desired mode (score, cumulated, relative, normalized, random)
    public List<Point> CalculateTrajectory(List<double> random, int mode, double p)
    {
        List<Point> trajectory = new List<Point>();
        List<int> values = new List<int>();
        double sum = 0;

        for (int i = 0; i < random.Count; i++)
        {
            if (random[i] < p)
            {
                values.Add(-1); // Penetration
            }
            else
            {
                values.Add(1);
            }
        }

        for (int i = 0; i < values.Count; i++)
        {
            if (mode == 0) // mode score
            {
                sum += values[i];
                trajectory.Add(new Point { X = i + 1, Y = sum });
            }
            else if (mode == 1) // mode cumulated
            {
                if (values[i] == 1)
                {
                    sum++;
                }
                trajectory.Add(new Point { X = i + 1, Y = sum });
            }
            else if (mode == 2) // mode relative
            {
                if (values[i] == 1)
                {
                    sum++;
                }
                trajectory.Add(new Point { X = i + 1, Y = (double)sum / (i + 1) });
            }
            else if (mode == 3) // mode normalized
            {
                if (values[i] == 1)
                {
                    sum++;
                }
                trajectory.Add(new Point { X = i + 1, Y = sum / Math.Sqrt(i + 1) });
            }
            else if (mode == 4) // mode random
            {
                sum += random[i];
                trajectory.Add(new Point { X = i + 1, Y = sum });
            }
        }
        return trajectory;
    }

    // Generates an array of random values
    public List<double> GenerateRandom(int N)
    {
        Random random = new Random();
        List<double> randomValues = new List<double>();
        for (int i = 0; i < N; i++)
        {
            randomValues.Add(random.NextDouble()); // Generate a random value between 0 and 1
        }
        return randomValues;
    }

    // Counts frequencies to be used by Barchart
    public List<int> CountFrequency(List<double> trajectoryValues, int intervals, double minValue, double maxValue)
    {
        List<int> frequency = new List<int>(new int[intervals]);

        double intervalSize = (maxValue - minValue) / intervals;

        for (int i = 0; i < trajectoryValues.Count; i++)
        {
            int interval = (int)((trajectoryValues[i] - minValue) / intervalSize);
            int index = interval == frequency.Count ? interval - 1 : interval;
            frequency[index]++;
        }
        return frequency;
    }

    // Generates M (# of systems) trajectories
    public List<List<Point>> GenerateTrajectories(int M, int N, double p)
    {
        List<List<Point>> trajectories = new List<List<Point>>();

        for (int i = 0; i < M; i++)
        {
            List<double> randomValues = GenerateRandom(N);

            // Generate trajectories for all the desired modes
            List<Point> trajectoryScore = CalculateTrajectory(randomValues, 0, p);
            List<Point> trajectoryAbs = CalculateTrajectory(randomValues, 1, p);
            List<Point> trajectoryRel = CalculateTrajectory(randomValues, 2, p);
            List<Point> trajectoryNorm = CalculateTrajectory(randomValues, 3, p);
            List<Point> trajectoryVarPoverM = CalculateTrajectory(new List<double>(new double[randomValues.Count]), 4, p);
            List<Point> trajectoryVarPoverNandM = CalculateTrajectory(randomValues, 4, p);

            trajectories.Add(trajectoryScore);
            trajectories.Add(trajectoryAbs);
            trajectories.Add(trajectoryRel);
            trajectories.Add(trajectoryNorm);
            trajectories.Add(trajectoryVarPoverM);
            trajectories.Add(trajectoryVarPoverNandM);
        }

        return trajectories;
    }

    // Some function to test the output
    public void CalculateAndPrintFrequency()
    {
        int N = 100; // Number of attacks
        int M = 10; // Number of systems
        double p = 0.2; // Probability of penetration
        int intervals = 5; // Number of intervals in each direction
        List<double> trajectoryEndValues = new List<double>();

        for (int i = 0; i < M; i++)
        {
            List<double> randomValues = GenerateRandom(N);
            List<Point> trajectory = CalculateTrajectory(randomValues, 1, p);
            Console.WriteLine($"{trajectory[N - 1].X} - {trajectory[N - 1].Y}");
            trajectoryEndValues.Add(trajectory[N - 1].Y);
        }

        double minValue = 0;
        double maxValue = N;
        List<int> frequency = CountFrequency(trajectoryEndValues, intervals, minValue, maxValue);

        double intervalSize = (maxValue - minValue) / intervals;
        Console.WriteLine("Frequency Array:");
        for (int i = 0; i < frequency.Count; i++)
        {
            double lowerBound = i * intervalSize + minValue;
            double upperBound = (i + 1) * intervalSize + minValue;
            if (i == frequency.Count - 1)
            {
                Console.WriteLine($"Interval [{lowerBound:F2}, {upperBound:F2}]: {frequency[i]}");
            }
            else
            {
                Console.WriteLine($"Interval [{lowerBound:F2}, {upperBound:F2}): {frequency[i]}");
            }
        }
    }
}

class Program
{
    static void Main(string[] args)
    {
        TrajectoryCalculator calculator = new TrajectoryCalculator();
        calculator.CalculateAndPrintFrequency();
    }
}
