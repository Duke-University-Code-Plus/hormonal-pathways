import matplotlib.pyplot as plt
import numpy as np
from rundelSmaxStudy import rundelSmaxStudy


xHistory, sHistory, cHistory, wHistory, wCumulative = rundelSmaxStudy()


def plotStudyResults(xHistory, sHistory, cHistory, wHistory, wCumulative):
    """
    Plots data from the 4 function files. They start with "run".

    Parameters (State Variables): 
      - xHistory: Tracks ENERGY given constants at each Time Period (1 reproductive cycle)

      - sHistory: Tracks SENSITIVITY TO HORMONE at different tissues at each Time Period (1 reproductive cycle)

      - cHistory: Tracks CONCENTRATION OF HORMONE given constants at each Time Period (1 reproductive cycle)

      - wHistory: Tracks FITNESS given constants at each Time Period (1 reproductive cycle)

      - wCumulative: Total FITNESS ACCUMULATED given constants at each Time Period (1 reproductive cycle)

    Returns: None

    Ouput: 10 plots
    """

    plt.figure(1)
    plt.clf
    plot_error_graphs(xHistory, 'Energy History w/ Error')

    
    plt.figure(2)
    plt.clf
    plot_error_graphs(sHistory, 'Sensitivity History w/ Error', legend=['S1', 'S2', 'S3'])

    plt.figure(3)
    plt.clf
    plot_error_graphs(cHistory, 'Circulating Level History w/ Error')

    plt.figure(4)
    plt.clf
    plot_error_graphs(wHistory, 'Fitness History w/ Error')

    plt.figure(5)
    plt.clf
    plot_error_graphs(wCumulative, 'Accumulated Fitness w/ Error')
    
    plt.figure(6)
    plt.clf
    plot_histories(xHistory, 'Energy Histories')

    plt.figure(7)
    plt.clf
    plot_histories(sHistory, 'Sensitivity Histories (S1)')

    plt.figure(8)
    plt.clf
    plot_histories(cHistory, 'Circulating Level Histories')

    plt.figure(9)
    plt.clf 
    plot_histories(wHistory, 'Fitness Histories')

    plt.figure(10)
    plt.clf
    plot_histories(wCumulative, 'Accumulated Fitnesses')
    


def calculate_mean_standardDev(historyData, nx, ny, nz):
    dataMean = np.zeros((nx, ny))
    dataStandardDev = np.zeros((nx, ny))
    for i in range(nx):
        for j in range(ny):
            dataMean[i, j] = np.sum(historyData[i, j, :]) / nz 
            dataStandardDev[i, j] = np.std(historyData[i, j, :])

    print(dataMean)
    print(dataStandardDev)

    #Returns
    return dataMean, dataStandardDev

def plot_error_graphs(historyData, title, legend=None):
    #unpacks dimensions of array from data: note - nz NOT used
    nx, ny, nz = historyData.shape 
    #computes mean and standard deviation from data
    mean, std = calculate_mean_standardDev(historyData, nx, ny, nz)

    #computes errorbars
    plt.errorbar(np.arange(1, ny + 1), mean[0, :], yerr = std[0, :])

    for i in range(1, nx):
        plt.errorbar(np.arange(1, ny + 1), mean[i, :], yerr = std[i, :])

    #plots errorbars
    if legend:
        plt.legend(legend, fontsize=14)

    plt.title(title)
    plt.show()

def plot_histories(historyData, title):
     #unpacks dimensions of array from data: note nx NOT used
    nx, ny, nz = historyData.shape

    #sets color vectors
    red = np.array([1, 0, 0])
    green = np.array([0, 0, 1])

    #calculates new color for each plot
    for i in range(nz):
        val = (i - 1) / nz
        color = (red * (nz - 1 - i) + green * i) / (nz - 1)

        plt.plot(np.arange(1, ny + 1), historyData[0, :, i], color=color)
    
    plt.title(title)
    plt.show()

plotStudyResults(xHistory, sHistory, cHistory, wHistory, wCumulative)