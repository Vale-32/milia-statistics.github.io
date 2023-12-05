import random
import matplotlib.pyplot as plt

class OnlineAverage:
    def __init__(self):
        self.total_sum = 0
        self.count = 0
        self.running_averages = []

    def update(self, new_number):
        # Update the running sum and count
        self.total_sum += new_number
        self.count += 1

        # Calculate and store the current running average
        current_average = self.total_sum / self.count
        self.running_averages.append(current_average)

# Example of using the OnlineAverage class with a stream of Monte Carlo numbers
online_avg = OnlineAverage()

# Generate a stream of 100 Monte Carlo numbers between 0 and 1
monte_carlo_stream = [random.random() for _ in range(100)]

# Process the stream online
for number in monte_carlo_stream:
    online_avg.update(number)

# Plot the running averages
plt.plot(online_avg.running_averages, label='Running Average', color='blue')
plt.scatter(range(len(monte_carlo_stream)), monte_carlo_stream, label='Monte Carlo Numbers', color='red', marker='.')
plt.xlabel('Number of Samples')
plt.ylabel('Value')
plt.title('Running Average and Monte Carlo Numbers')
plt.legend()
plt.show()
