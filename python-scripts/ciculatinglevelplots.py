import numpy as np
import matplotlib
import matplotlib.pyplot as plt
matplotlib.use('TkAgg')

def circulating_level_plots():
    N = 5
    K = np.linspace(1, 5, N)
    cc = np.linspace(0, 20, 200)

    Vhist = np.zeros((N, 200))

    for i in range(N):
        for j in range(200):
            Vhist[i, j] = cc[j] / (cc[j] + K[i])
    
    plt.figure(1)
    plt.clf()
    red = np.array([1, 0, 0])
    blue = np.array([0, 0, 1])

    for i in range(N):
        color = (red * (N - 1 - i) + blue * i) / (N - 1) #Math on outputing color was fixed
        plt.plot(cc, Vhist[i, :], color=color, linewidth=2)
        #plt.hold(True) -old
    
    plt.xticks(fontname="Sans", fontsize="16")
    plt.yticks(fontname="Sans", fontsize="16")
    plt.legend("ABCDE")
    plt.gcf().set_size_inches(9, 5)
    plt.show()

circulating_level_plots()


