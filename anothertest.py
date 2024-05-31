import matplotlib.pyplot as plt
import numpy as np
from scipy.optimize import minimize
from scipy.stats import beta as beta_dist
import matplotlib.cm as cm

def hormoneModel():
    numberOflines = 10 #number of lines to plot
    alphaParam = 0.6 #alpha parameter for line plot
    # Define constants
    gamma = np.array([.1, 2, .3])
    G = 0.1
    Xmin = 1
    delSmax = np.linspace(1, 10, numberOflines)
    delCmax = 1
    tau = 5
    K = 1
    alpha = 4
    beta = 2
    mu = 0.01
    z = np.array([.2, .3, .3])
    
    # Define simulation parameters
    N = 100
    
    # Create a colormap
    colormap = cm.coolwarm(np.linspace(0, 1, numberOflines))
    
    # Initialize plots
    plt.figure(1)
    plt.title('Energy History')
    
    plt.figure(2)
    plt.title('Sensitivity History')
    
    plt.figure(3)
    plt.title('Circulating Level History')
    
    plt.figure(4)
    plt.title('Fitness History')
    
    plt.figure(5)
    plt.title('Accumulated Fitness')
    
    for j in range(numberOflines):
        # States being tracked
        Xhist = np.zeros(N)
        Shist = np.zeros((3, N))
        Chist = np.zeros(N)
        Whist = np.zeros(N)
        Wcuml = np.zeros(N)
        
        # Populate with initial conditions
        Xhist[0] = 0.1
        Shist[:, 0] = [1, 1, 1]
        Chist[0] = 1
        Whist[0] = 0
        alive = True
        i = 0
        while alive and i < N - 1:
            # Find beta for this timestep
            beta_t = beta_dist.rvs(alpha, beta)
            # Define food availability
            if 10 < i < 30:
                F_t = 0.4
            else:
                F_t = 1
            E_t = tau * F_t

            X_t1, S_t1, C_t1, W_t1 = forwardModel(Xhist[i], beta_t, z, Shist[:, i], Chist[i], K, E_t, gamma, delCmax, delSmax[j], Xmin, G)
            Xhist[i + 1] = X_t1
            Shist[:, i + 1] = S_t1
            Chist[i + 1] = C_t1
            Whist[i + 1] = W_t1

            if np.random.rand() < mu or X_t1 < 0:
                alive = False
            Wcuml[i + 1] = Wcuml[i] + W_t1

            i += 1

        # Add data to plots with color based on colormap
        color = colormap[j]
        
        plt.figure(1)
        plt.plot(range(N), Xhist, label=f'delSmax={delSmax[j]:.1f}', color=color,linewidth=3,alpha=alphaParam)
        
        plt.figure(2)
        plt.plot(range(N), Shist[0, :], color=color, alpha=alphaParam,linewidth=3)
        plt.plot(range(N), Shist[1, :], color=color, alpha=alphaParam,linewidth=3)
        plt.plot(range(N), Shist[2, :], color=color, alpha=alphaParam,linewidth=3)
        
        plt.figure(3)
        plt.plot(range(N), Chist, label=f'delSmax={delSmax[j]:.1f}', color=color,linewidth=3,alpha=alphaParam)
        
        plt.figure(4)
        plt.plot(range(N), Whist, label=f'delSmax={delSmax[j]:.1f}', color=color,linewidth=3,alpha=alphaParam)
        
        plt.figure(5)
        plt.plot(range(N), Wcuml, label=f'delSmax={delSmax[j]:.1f}', color=color,linewidth=3,alpha=alphaParam)
    
    # Show plots with legends
    plt.figure(1)
    plt.legend()
    
    plt.figure(2)
    plt.legend(['S1', 'S2', 'S3'])
    
    plt.figure(3)
    plt.legend()
    
    plt.figure(4)
    plt.legend()
    
    plt.figure(5)
    plt.legend()
    
    plt.show()

def forwardModel(X_t, beta_t, z_t, S_t, C_t, K, E_t1, gamma_t, delCmax, delSmax, Xmin, G):
    def fitness(delCS):
        return fitnessFunc(beta_t, z_t, S_t, C_t, K, X_t, E_t1, gamma_t, delCS, Xmin, G)
    
    bounds = [(-delSmax, delSmax), (-delSmax, delSmax), (-delSmax, delSmax), (-delCmax, delCmax)]
    result = minimize(fitness, [0, 0, 0, 0], bounds=bounds) 
    delMaxCS = result.x 
    
    V_t = np.zeros_like(S_t)
    V_t[0] = (S_t[0] + delMaxCS[0]) * (C_t + delMaxCS[3]) / (K + (C_t + delMaxCS[3]))
    V_t[1] = (S_t[1] + delMaxCS[1]) * (C_t + delMaxCS[3]) / (K + (C_t + delMaxCS[3]))
    V_t[2] = (S_t[2] + delMaxCS[2]) * (C_t + delMaxCS[3]) / (K + (C_t + delMaxCS[3]))
    
    X_t1 = X_t + E_t1 - np.dot(gamma_t, V_t)
    W_t1 = beta_t * np.prod(V_t ** z_t)
    
    S_t1 = S_t + delMaxCS[:3]
    C_t1 = C_t + delMaxCS[3]
    
    return X_t1, S_t1, C_t1, W_t1

def fitnessFunc(beta, z, S, C, K, X_t, E_t1, gamma, delCS, Xmin, G):
    V = np.zeros_like(S)
    
    V[0] = (S[0] + delCS[0]) * (C + delCS[3]) / (K + (C + delCS[3]))
    V[1] = (S[1] + delCS[1]) * (C + delCS[3]) / (K + (C + delCS[3]))
    V[2] = (S[2] + delCS[2]) * (C + delCS[3]) / (K + (C + delCS[3]))
    
    V = np.maximum(V, 0)
    
    W_t1 = beta * np.prod(V ** z)
    
    X_t1 = X_t + E_t1 - np.dot(gamma, V)
    
    if X_t1 < Xmin or np.any(V < G):
        W_t1 = 0
    
    return -(W_t1 ** 1) * (X_t1 ** 3)

# Run the model
hormoneModel()
