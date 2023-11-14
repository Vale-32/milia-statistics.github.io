using System;

class SecuritySimulation
{
    static void Main()
    {
        // Constants
        int numberOfSystems = 100000; // Number of systems to simulate
        int numberOfAttacks = 50; // Number of attacks on each system

        // Possible values for S
        int[] securityScores = { 20, 60, 100 };

        // Loop over each value of S
        foreach (int securityScore in securityScores)
        {
            Console.WriteLine($"Simulation results for S = {securityScore}:");

            // Loop over various values of P
            for (int k = 2; k <= 10; k++)
            {
                int penetrationThreshold = k * 10;
                int unsecureCount = 0;

                // Simulate multiple systems
                for (int i = 0; i < numberOfSystems; i++)
                {
                    // Simulate attacks on each system
                    int security = 0;
                    bool systemDiscarded = false;

                    for (int j = 0; j < numberOfAttacks; j++)
                    {
                        // Simulate penetration score for each attack
                        int penetrationScore = new Random().Next(0, 101);

                        if (penetrationScore >= penetrationThreshold)
                        {
                            // System is considered unsecure
                            systemDiscarded = true;
                            break;
                        }

                        security += securityScore;

                        if (security >= 100)
                        {
                            // System reached security score, not discarded
                            break;
                        }
                    }

                    if (systemDiscarded)
                    {
                        unsecureCount++;
                    }
                }

                // Calculate and display the probability of being discarded
                double probability = (double)unsecureCount / numberOfSystems;
                Console.WriteLine($"P = {penetrationThreshold}, Probability of being discarded: {probability:P}");
            }

            Console.WriteLine();
        }
    }
}
