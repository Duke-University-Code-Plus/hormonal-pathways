import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import minimize
from scipy.stats import beta as beta_dist

'''
;;;;;;;;;;;;;;;;;;;;;;;;
THIS ONE WORKS. No change added
;;;;;;;;;;;;;;;;;;;;;;;;
'''

def hormoneModel():
    # define constants:
    
    # weights on trait selection against mating effort:
    gamma = 0.1 * np.ones(3)
    
    # Minimum hormonal state permissive of gamete maturation
    G = 0.1
    
    # Minimum body condition permissive of reproduction
    Xmin = 1
    
    # max change in sensitivity
    delSmax = 0.5
    
    # max change in production
    delCmax = 0.9
    
    # Food availability
    tau = 1
    
    # Michaelis-Menten Constant
    K = 1
    
    # parameters for beta distribution over reproductive efficacy
    alpha = 2
    beta = 2
    
    # mortality probability
    mu = 0.005
    
    # exponents in fitness function
    z = np.ones(3)
    
    # define simulation parameters
    alive = True
    N = 100
    
    # states being tracked
    Xhist = np.zeros(N)
    Shist = np.zeros((3, N))
    Chist = np.zeros(N)
    Whist = np.zeros(N)
    
    # populate with initial conditions
    Xhist[0] = 1
    Shist[:, 0] = [1, 1, 1]
    Chist[0] = 1
    Whist[0] = 1
    
    i = 0
    while alive and i < N - 1:
        # find beta for this timestep:
        beta_t = beta_dist.rvs(alpha, beta)
        # define food availability
        F_t = 1
        E_t = tau * F_t
        
        X_t1, S_t1, C_t1, W_t1 = forwardModel(Xhist[i], beta_t, z, Shist[:, i], Chist[i], K, E_t, gamma, delCmax, delSmax, Xmin, G)
        Xhist[i + 1] = X_t1
        Shist[:, i + 1] = S_t1
        Chist[i + 1] = C_t1
        Whist[i + 1] = W_t1
        
        if np.random.rand() < mu:
            alive = False
        
        # increment the counter
        i += 1
    
    # plot the results
    plt.figure(1)
    plt.clf()
    plt.plot(range(N), Xhist)
    plt.title('Energy History')
    
    plt.figure(2)
    plt.clf()
    plt.plot(range(N), Shist[0, :], 'r', range(N), Shist[1, :], 'b')
    plt.title('Sensitivity History')
    
    plt.figure(3)
    plt.clf()
    plt.plot(range(N), Chist)
    plt.title('Circulating Level History')
    
    plt.figure(4)
    plt.clf()
    plt.plot(range(N), Whist)
    plt.title('Fitness History')
    
    plt.show()

def forwardModel(X_t, beta_t, z_t, S_t, C_t, K, E_t1, gamma_t, delCmax, delSmax, Xmin, G):
    def fitness(delCS):
        return -computeFitness(beta_t, z_t, S_t, C_t, K, X_t, E_t1, gamma_t, delCS, Xmin, G)
    
    bounds = [(-delSmax, delSmax), (-delSmax, delSmax), (-delCmax, delCmax)]
    result = minimize(fitness, [0, 0, 0], bounds=bounds)
    delMaxCS = result.x
    
    V_t = np.zeros_like(S_t)
    V_t[0] = (S_t[0] + delMaxCS[0]) * (C_t + delMaxCS[2]) / (K + (C_t + delMaxCS[2]))
    V_t[1] = (S_t[1] + delMaxCS[1]) * (C_t + delMaxCS[2]) / (K + (C_t + delMaxCS[2]))
    V_t[2] = S_t[2] * (C_t + delMaxCS[2]) / (K + (C_t + delMaxCS[2]))
    
    X_t1 = X_t + E_t1 - np.dot(gamma_t, V_t)
    W_t1 = beta_t * (V_t[0]**z_t[0]) * (V_t[1]**z_t[1]) * (V_t[2]**z_t[2])
    
    S_t1 = S_t + np.array([delMaxCS[0], delMaxCS[1], 0])
    C_t1 = C_t + delMaxCS[2]
    
    return X_t1, S_t1, C_t1, W_t1

def computeFitness(beta, z, S, C, K, X_t, E_t1, gamma, delCS, Xmin, G):
    V = np.zeros_like(S)
    V[0] = (S[0] + delCS[0]) * (C + delCS[2]) / (K + (C + delCS[2]))
    V[1] = (S[1] + delCS[1]) * (C + delCS[2]) / (K + (C + delCS[2]))
    V[2] = S[2] * (C + delCS[2]) / (K + (C + delCS[2]))
    
    W_t1 = beta * (V[0]**z[0]) * (V[1]**z[1]) * (V[2]**z[2])
    
    X_t1 = X_t + E_t1 - np.dot(gamma, V)
    
    if X_t1 < Xmin or V[0] < G:
        W_t1 = 0
    
    return W_t1

hormoneModel()


