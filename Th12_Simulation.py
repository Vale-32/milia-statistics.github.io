import numpy as np
import matplotlib.pyplot as plt

# Parameters
mu = 0.1  # Drift
sigma = 0.2  # Volatility
T = 1.0  # Total time
N = 1000  # Number of time steps
dt = T / N  # Time step

# Initial condition
X0 = 1.0

# Generate Brownian motion increments
dW = np.sqrt(dt) * np.random.randn(N)

# Initialize the path
X = np.zeros(N+1)
X[0] = X0

# Simulate Itō integration using Euler-Maruyama method
for i in range(1, N+1):
    X[i] = X[i-1] + mu * X[i-1] * dt + sigma * X[i-1] * dW[i-1]

# Plot the simulated path
time = np.linspace(0.0, T, N+1)
plt.plot(time, X, label='Simulated Path')
plt.xlabel('Time')
plt.ylabel('Value')
plt.title('Itō Integration - Geometric Brownian Motion')
plt.legend()
plt.show()
