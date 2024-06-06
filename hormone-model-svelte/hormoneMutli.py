import numpy as np
from scipy.optimize import minimize
from scipy.stats import beta as beta_dist

def runMutliRun(gammaIn : np.array = np.array([.1, 2, .3]), 
                 GIn : float = 0.1, XminIn : float = 1, delSmaxIn : np.array = np.array([10, 20, 1]),
                 delCmaxIn : float = 1, tauIn : float = 5, KIn : float = 1, 
                 alphaIn : float = 2, betaIn : float = 2, muIn : float = 0.0001, 
                 zIn : np.array = np.array([0.2, 0.3, 0.3]), NIn : int = 100, 
                 foodShort : int = 0.5, foodShortbegin : int = 8, foodShortend : int = 20, numRuns : int = 20):
    # define constants:
    # weights on trait selection against mating effort:
    gamma = gammaIn
    
    # Minimum hormonal state permissive of gamete maturation
    G = GIn
    
    # Minimum body condition permissive of reproduction
    Xmin = XminIn
    
    # max change in sensitivity
    delSmax = np.linspace(delSmaxIn[0], delSmaxIn[1], numRuns)
    
    # max change in production
    delCmax = delCmaxIn
    
    # Food availability
    tau = tauIn
    
    # Michaelis-Menten Constant
    K = KIn

    # parameters for beta distribution over reproductive efficacy
    alpha = alphaIn
    beta = betaIn
    
    # mortality probability
    mu = muIn
    
    # exponents in fitness function
    z = zIn
    
    # define simulation parameters
    alive = True
    N = NIn

    # states being tracked
    Xhist = np.zeros((1, N, 20))
    Shist = np.zeros((3, N, 20))
    Chist = np.zeros((1, N, 20))
    Whist = np.zeros((1, N, 20))
    Wcuml = np.zeros((1, N, 20))

    for j in range(numRuns):
        # populate with initial conditions
        Xhist[0, 0, j] = 1
        Shist[:, 0, j] = np.array([1, 1, 1])
        Chist[0, 0, j] = 1
        Whist[0, 0, j] = 1
        alive = True
        i = 0

        while alive and i < N - 1:
            # find beta for this timestep:
            beta_t = beta_dist.rvs(alpha, beta)
            # define food availability
            if foodShortbegin < i < foodShortend:
                F_t = foodShort
            else:
                F_t = 1
            
            E_t = tau * F_t
                

            X_t1, S_t1, C_t1, W_t1 = forwardModel(Xhist[0, i, j], beta_t, z, Shist[:, i, j], Chist[0, i, j], K, E_t, gamma, delCmax, delSmax[j], Xmin, G)
            Xhist[0, i + 1, j] = X_t1
            Shist[:, i + 1, j] = S_t1
            Chist[0, i + 1, j] = C_t1
            Whist[0, i + 1, j] = W_t1

            if np.random.rand() < mu or X_t1 < 0:
                alive = False

            Wcuml[0, i + 1, j] = Wcuml[0, i, j] + W_t1
            i += 1
    results = {
        'Xhist': Xhist.tolist(),
        'Shist': Shist.tolist(),
        'Chist': Chist.tolist(),
        'Whist': Whist.tolist(),
        'Wcuml': Wcuml.tolist()
    }
    return Xhist, Shist, Chist, Whist, Wcuml

def forwardModel(X_t, beta_t, z_t, S_t, C_t, K, E_t1, gamma_t, delCmax, delSmax, Xmin, G):
    def fitness(delCS):
        return -fitness_function(beta_t, z_t, S_t, C_t, K, X_t, E_t1, gamma_t, delCS, Xmin, G)

    bounds = [(-delSmax, delSmax), (-delSmax, delSmax), (-delSmax, delSmax), (-delCmax, delCmax)]
    result = minimize(fitness, [0, 0, 0, 0], bounds=bounds)
    delMaxCS = result.x

    delMaxCS[0] = max(delMaxCS[0], -S_t[0])
    delMaxCS[1] = max(delMaxCS[1], -S_t[1])
    delMaxCS[2] = max(delMaxCS[2], -S_t[2])

    V_t = np.zeros_like(S_t)
    V_t[0] = (S_t[0] + delMaxCS[0]) * (C_t + delMaxCS[3]) / (K + (C_t + delMaxCS[3]))
    V_t[1] = (S_t[1] + delMaxCS[1]) * (C_t + delMaxCS[3]) / (K + (C_t + delMaxCS[3]))
    V_t[2] = (S_t[2] + delMaxCS[2]) * (C_t + delMaxCS[3]) / (K + (C_t + delMaxCS[3]))

    X_t1 = X_t + E_t1 - np.dot(gamma_t, V_t)
    W_t1 = beta_t * (V_t[0] ** z_t[0]) * (V_t[1] ** z_t[1]) * (V_t[2] ** z_t[2])

    S_t1 = S_t + delMaxCS[:3]
    C_t1 = C_t + delMaxCS[3]

    return X_t1, S_t1, C_t1, W_t1

def fitness_function(beta, z, S, C, K, X_t, E_t1, gamma, delCS, Xmin, G):
    V = np.zeros_like(S)
    V[0] = (S[0] + delCS[0]) * (C + delCS[3]) / (K + (C + delCS[3]))
    V[1] = (S[1] + delCS[1]) * (C + delCS[3]) / (K + (C + delCS[3]))
    V[2] = (S[2] + delCS[2]) * (C + delCS[3]) / (K + (C + delCS[3]))

    V[V < 0] = 0

    W_t1 = beta * (abs(V[0]) ** z[0]) * (abs(V[1]) ** z[1]) * (abs(V[2]) ** z[2])
    X_t1 = X_t + E_t1 - np.dot(gamma, V)

    if X_t1 < Xmin or any(V < G):
        W_t1 = 0

    return -(abs(W_t1) ** 3) * (abs(X_t1) ** 0.01)

runMutliRun()
