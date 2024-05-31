import numpy as np
import matplotlib.pyplot as plt
#from runGStudy import runGStudy
#from rungamma1Study import rungamma1Study
from rundelSmaxStudy import rundelSmaxStudy
#from runKStudy import runKStudy
#from rundelSmaxStudy import rundelSmaxStudy
 
Xhist, Shist, Chist, Whist, Wcuml = rundelSmaxStudy()
#Xhist, Shist, Chist, Whist, Wcuml = runGStudy()
#Xhist, Shist, Chist, Whist, Wcuml = runKStudy()
#Xhist, Shist, Chist, Whist, Wcuml = rungamma1Study()


def plotStudyResults(Xhist, Shist, Chist, Whist, Wcuml):
    def plot_errorbar(data, title, legend=None):
        nx, ny, nz = data.shape
        mean = np.mean(data, axis=2)
        std = np.std(data, axis=2)
        
        plt.errorbar(range(1, ny+1), mean[0, :], yerr=std[0, :])
        for i in range(1, nx):
            plt.errorbar(range(1, ny+1), mean[i, :], yerr=std[i, :], color=np.random.rand(3,), linewidth=2)
        
        plt.title(title, fontsize=20, fontname='Arial', fontweight='bold')
        plt.gca().tick_params(axis='both', which='major', labelsize=24)
        plt.gca().set_facecolor('white')
        plt.gcf().set_size_inches(14, 9)
        if legend:
            plt.legend(legend, fontsize=14)
        plt.show()

    def plot_histories(data, title):
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