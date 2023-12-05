import numpy as np
import matplotlib.pyplot as plt

def wiener_process(T, N):
    dt = T / N
    t = np.linspace(0, T, N+1)
    W = np.zeros(N+1)

    for i in range(1, N+1):
        dW = np.random.normal(0, np.sqrt(dt))
        W[i] = W[i-1] + dW

    return t, W

def geometric_brownian_motion(S0, mu, sigma, T, N):
    dt = T / N
    t = np.linspace(0, T, N+1)
    S = np.zeros(N+1)
    S[0] = S0

    for i in range(1, N+1):
        dZ = np.random.normal(0, np.sqrt(dt))
        S[i] = S[i-1] * np.exp((mu - 0.5 * sigma**2) * dt + sigma * np.sqrt(dt) * dZ)

    return t, S

# Example usage:
T = 1
N = 100
S0 = 100
mu = 0.1
sigma = 0.2

t_wiener, W = wiener_process(T, N)
t_gbm, S = geometric_brownian_motion(S0, mu, sigma, T, N)

plt.figure(figsize=(12, 6))
plt.subplot(1, 2, 1)
plt.plot(t_wiener, W)
plt.title('Wiener Process')
plt.xlabel('Time')
plt.ylabel('W(t)')

plt.subplot(1, 2, 2)
plt.plot(t_gbm, S)
plt.title('Geometric Brownian Motion')
plt.xlabel('Time')
plt.ylabel('S(t)')

plt.show()
