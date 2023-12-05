import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import norm

# Set random seed for reproducibility
np.random.seed(42)

def empirical_process_sample(n):
    # Generate n samples from a standard normal distribution
    return np.random.randn(n)

def donsker_invariance_principle(n_samples, n_obs):
    # Generate n_samples empirical processes with n_obs observations each
    processes = np.array([empirical_process_sample(n_obs) for _ in range(n_samples)])

    # Apply Donsker's Invariance Principle
    standardized_processes = np.sqrt(n_obs) * (processes - processes.mean(axis=1)[:, np.newaxis])

    return standardized_processes

def plot_simulation_and_expected(n_samples, n_obs):
    # Generate standardized empirical processes using Donsker's Invariance Principle
    standardized_processes = donsker_invariance_principle(n_samples, n_obs)

    # Plot the simulated processes
    plt.figure(figsize=(10, 6))
    for i in range(n_samples):
        plt.plot(np.linspace(0, 1, n_obs), standardized_processes[i, :])

    # Plot the expected Gaussian distribution
    x = np.linspace(-3, 3, 1000)
    plt.plot(x, norm.pdf(x), 'r', label='Expected Gaussian Distribution')

    plt.title(f'Simulation of Donsker\'s Invariance Principle ({n_samples} processes, {n_obs} observations each)')
    plt.xlabel('Time')
    plt.ylabel('Standardized Empirical Process')
    plt.legend()
    plt.show()

# Parameters for simulation
num_samples = 5
num_observations = 1000

# Plot the simulation and compare with the expected Gaussian distribution
plot_simulation_and_expected(num_samples, num_observations)
