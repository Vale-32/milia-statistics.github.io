import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
# import plotly # for plotting
import matplotlib.pyplot as plt # for plotting
import scipy
import scipy.stats as st # for statistical calculations
from scipy.stats import norm # normal distribution
# import statsmodels.api as sm # to build the Q-Q graph

# Upload the dataset and check the first few rows
students = pd.read_csv("StudentsPerformance.csv")
print(students.head())

# Get statistical overview
print(students.describe())

# Set general plot dimensions
plt.rcParams["figure.figsize"] = (15,10)
plt.xlim([0,100])

# Build three subplots
plt.subplot(1, 3, 1)
math = plt.hist(students['math score'], 15, density = True, color = "green")
plt.title("Math Scores")

plt.subplot(1, 3, 2)
reading = plt.hist(students['reading score'], 15, density = True, color = "orange")
plt.title("Reading Scores")

plt.subplot(1, 3, 3)
reading = plt.hist(students['writing score'], 15, density = True, color = "blue")
plt.title("Writing Scores")

# Set the global title
plt.suptitle("Normality check of students scores using histograms")
plt.show()

# Math parameters and array
print("Math parameters:")
mean_math = np.mean(students['math score'])
print('Estimated mean: ', mean_math)
std_math = np.std(students['math score'])
print('Estimated standard deviation: ',  std_math, '\n')
x_math = np.arange(10,100,1)
y_math = norm.pdf(x_math, mean_math, std_math)

# Reading parameters and array
print("Reading parameters:")
mean_reading = np.mean(students['reading score'])
print('Estimated mean: ', mean_reading)
std_reading = np.std(students['reading score'])
print('Estimated standard deviation: ',  std_reading, '\n')
x_reading = np.arange(10,100,1)
y_reading = norm.pdf(x_reading, mean_reading, std_reading)

# Writing parameters and array
print("Writing parameters:")
mean_writing = np.mean(students['writing score'])
print('Estimated mean: ', mean_writing)
std_writing = np.std(students['writing score'])
print('Estimated standard deviation: ',  std_writing, '\n')
x_writing = np.arange(10,100,1)
y_writing = norm.pdf(x_writing, mean_writing, std_writing)

# Set general plot dimensions
plt.rcParams["figure.figsize"] = (15,10)
plt.xlim([10,100])

# Build three subplots
plt.subplot(1, 3, 1)
plt.plot(x_math, y_math, label = 'fitted curve', color = "black")
plt.hist(students['math score'], 15, density = True, color = "green")
plt.title("Math Scores")

plt.subplot(1, 3, 2)
plt.plot(x_reading, y_reading, label = 'fitted curve', color = "black")
plt.hist(students['reading score'], 15, density = True, color = "orange")
plt.title("Reading Scores")

plt.subplot(1, 3, 3)
plt.plot(x_writing, y_writing, label = 'fitted curve', color = "black")
plt.hist(students['writing score'], 15, density = True, color = "blue")
plt.title("Writing Scores")

# Set the global title
plt.suptitle("Normality check of students scores using fitted curve")

plt.show()