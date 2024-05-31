import numpy as np
from scipy.optimize import minimize

"""
DOES NOT WORK
"""

def hormone_model():
    # define constants:
    
    # weights on trait selection against mating effort:
    gamma = np.array([0.1, 2, 0.3])
    
    # Minimum hormonal state permissive of gamete maturation
    G = 0.1
    
    # Minimum body condition permissive of reproduction
    Xmin = 1
    
    # max change in sensitivity
    delSmax = 1
    
    # max change in production
    delCmax = 1
    
    # Food availability
    tau = 5
    
    # Michaelis-Menten Constant
    K = 1
    
    # parameters for beta distribution over reproductive efficacy
    alpha = 4
    beta = 2
    
    # mortality probability
    mu = 0.01
    
    # exponents in fitness function
    z = np.array([0.2, 0.3, 0.3])
    
    # define simulation parameters
    alive = True
    N = 100
    
    # states being tracked
    Xhist = np.zeros(N)
    Shist = np.zeros((3, N))
    Chist = np.zeros(N)
    Whist = np.zeros(N)
    Wcuml = np.zeros(N)
    
    # populate with initial conditions
    Xhist[0] = 0.1
    Shist[:, 0] = [1, 1, 1]
    Chist[0] = 1
    Whist[0] = 0
      
    i = 0
    while (alive and (i < N-1)):
        # find beta for this timestep:
        beta_t = np.random.beta(alpha, beta)
        # define food availability
        F_t = 1
        E_t = tau * F_t
        
        X_t1, S_t1, C_t1, W_t1 = forward_model(Xhist[i], beta_t, z, Shist[:, i], Chist[i], K, E_t, gamma, delCmax, delSmax, Xmin, G)
        Xhist[i+1] = X_t1
        Shist[:, i+1] = S_t1
        Chist[i+1] = C_t1
        Whist[i+1] = W_t1
        
        if np.random.rand() < mu or X_t1 < 0:
            alive = False
        Wcuml[i+1] = Wcuml[i] + W_t1
        # increment the counter
        i += 1
    
    # plot the results
    import matplotlib.pyplot as plt
    plt.figure(1)
    plt.clf()
    plt.plot(np.arange(1, N+1), Xhist)
    plt.title('Energy History')
    
    plt.figure(2)
    plt.clf()
    plt.plot(np.arange(1, N+1), Shist[0, :], 'r', np.arange(1, N+1), Shist[1, :], 'b', np.arange(1, N+1), Shist[2, :], 'g')
    plt.title('Sensitivity History')
    plt.legend(['S1', 'S2', 'S3'])
    
    plt.figure(3)
    plt.clf()
    plt.plot(np.arange(1, N+1), Chist)
    plt.title('Circulating Level History')
    
    plt.figure(4)
    plt.clf()
    plt.plot(np.arange(1, N+1), Whist)
    plt.title('Fitness History')
    
    plt.figure(5)
    plt.clf()
    plt.plot(np.arange(1, N+1), Wcuml)
    plt.title('Accumulated Fitness')

def forward_model(X_t, beta_t, z_t, S_t, C_t, K, E_t1, gamma_t, delCmax, delSmax, Xmin, G):
    def fitness(beta, z, S, C, K, X_t, E_t1, gamma, delCS, Xmin, G):
        V = np.zeros_like(S)
        V[0] = (S[0] + delCS[0])*(C + delCS[3]) / (K + (C + delCS[3]))
        V[1] = (S[1] + delCS[1])*(C + delCS[3]) / (K + (C + delCS[3]))
        V[2] = (S[2] + delCS[2])*(C + delCS[3]) / (K + (C + delCS[3]))
        if (S[0] + delCS[0]) < 0:
            V[0] = 0
        if (S[1] + delCS[1]) < 0:
            V[1] = 0
        if (S[2] + delCS[2]) < 0:
            V[2] = 0
        W_t1 = beta * (V[0]**z[0]) * (V[1]**z[1]) * (V[2]**z[2])
        X_t1 = X_t + E_t1 - np.dot(gamma, V)
        if X_t1 < Xmin:
            W_t1 = 0
        if V[0] < G:
            W_t1 = 0
        return -(W_t1**1) * (X_t1**3)
    
    delMaxCS = minimize(lambda x: fitness(beta_t, z_t, S_t, C_t, K, X_t, E_t1, gamma_t, x, Xmin, G), np.zeros(4), A_eq=None, b_eq=None, A_ineq=None, b_ineq=None, lb=-np.array([delSmax, delSmax, delSmax, delCmax]), ub=np.array([delSmax, delSmax, delCmax, delCmax]))
    
    V_t = np.zeros_like(S_t)
    V_t[0] = (S_t[0] + delMaxCS[0])*(C_t + delMaxCS[3]) / (K + (C_t + delMaxCS[3]))
    V_t[1] = (S_t[1] + delMaxCS[1])*(C_t + delMaxCS[3]) / (K + (C_t + delMaxCS[3]))
    V_t[2] = (S_t[2] + delMaxCS[2])*(C_t + delMaxCS[3]) / (K + (C_t + delMaxCS[3]))
    
    X_t1 = X_t + E_t1 - np.dot(gamma_t, V_t)
    W_t1 = beta_t * (V_t[0]**z_t[0]) * (V_t[1]**z_t[1]) * (V_t[2]**z_t[2])
    
    S_t1 = S_t + delMaxCS[:3]
    C_t1 = C_t + delMaxCS[3]
    
    return X_t1, S_t1, C_t1, W_t1

hormone_model()