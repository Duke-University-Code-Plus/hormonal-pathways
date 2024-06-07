import numpy as np
import matplotlib.pyplot as plt
#from rungamma1Study import rungamma1Study
from rundelSmaxStudy import rundelSmaxStudy

Xhist, Shist, Chist, Whist, Wcuml = rundelSmaxStudy()
#Xhist, Shist, Chist, Whist, Wcuml = rungamma1Study()


def plotStudyResults(Xhist, Shist, Chist, Whist, Wcuml):
    """
    plot the data returned by rundelSmaxStudy.py. 

    Parameters: 
    Xhist (tuple) - array representing history an organism's energy state at each times step
    Shist (tuple) - array representing history an organism's receptor sensitivity at each times step
    Chist (tuple) - array representing history an organism's ciculating hormone level at each times step
    Whist (tuple) - array representing history an organism's expected reproductive success at each times step
    Wcuml (tuple) - array representing accumulated fitness (an individual organism's reproductive success) at each times step
    """
    def plot_errorbar(data, title, legend=None):
        """
        Plot individual errorbar from the parameter.

        Parameters:
        data: array containing the data
        title: title of the plot
        """
        
        #assigns array dimensions into the data 
        nx, ny, nz = data.shape
        #calculates the mean values of nz 
        mean = np.mean(data, axis=2)
        #calculates the standard deviation values of nz 
        std = np.std(data, axis=2)
        
        #retrieves the mean and standard deviation values to create an error bar on x values from 1 to ny and 
        plt.errorbar(range(1, ny+1), mean[0, :], yerr=std[0, :])

        #creates an error bar for each set of data from 1 to nx in a random color 
        for i in range(1, nx):
            plt.errorbar(range(1, ny+1), mean[i, :], yerr=std[i, :], color=np.random.rand(3,), linewidth=2)
        
        #initializes basic design for the plots 
        plt.title(title, fontsize=20, fontname='Arial', fontweight='bold')
        plt.gca().tick_params(axis='both', which='major', labelsize=24)
        plt.gca().set_facecolor('white')
        plt.gcf().set_size_inches(14, 9)
        if legend:
            plt.legend(legend, fontsize=14)
        plt.show()

    def plot_histories(data, title):
        """
        Plot individual history from the parameter.

        Parameters:
        data: array containing the data
        title: title of the plot
        """

        nx, ny, nz = data.shape
        redColor = np.array([1, 0, 0])
        greenColor = np.array([0, 0, 1])
        

        for i in range(nz):
            val = (i) / nz
            plt.plot(range(1, ny+1), data[0, :, i], color=redColor*(1-val) + greenColor*val, linewidth=2)
        
        plt.title(title, fontsize=20, fontname='Arial', fontweight='bold')
        plt.gca().tick_params(axis='both', which='major', labelsize=24)
        plt.gca().set_facecolor('white')
        plt.gcf().set_size_inches(14, 9)
        plt.show()

    plt.figure(1)
    plt.clf()
    plot_errorbar(Xhist, 'Energy History')

    plt.figure(2)
    plt.clf()
    plot_errorbar(Shist, 'Sensitivity History', legend=['S1', 'S2', 'S3'])

    plt.figure(3)
    plt.clf()
    plot_errorbar(Chist, 'Circulating Level History')

    plt.figure(4)
    plt.clf()
    plot_errorbar(Whist, 'Fitness History')

    plt.figure(5)
    plt.clf()
    plot_errorbar(Wcuml, 'Accumulated Fitness')

    plt.figure(6)
    plt.clf()
    plot_histories(Xhist, 'Energy Histories')

    plt.figure(7)
    plt.clf()
    plot_histories(Shist, 'Sensitivity Histories (S1)')

    plt.figure(8)
    plt.clf()
    plot_histories(Chist, 'Circulating level histories')

    plt.figure(9)
    plt.clf()
    plot_histories(Whist, 'Fitness Histories')

    plt.figure(10)
    plt.clf()
    plot_histories(Wcuml, 'Accumulated Fitnesses')

plotStudyResults(Xhist, Shist, Chist, Whist, Wcuml)
