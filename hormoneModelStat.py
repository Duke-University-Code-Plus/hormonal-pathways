import numpy as np
from scipy.optimize import minimize
from scipy.stats import beta as beta_dist
import json

def hormoneModelStatRun(gammaIn: np.array = np.array([.1, 2, .3]), 
                GIn: float = 0.1, XminIn: float = 1, delSmaxIn: float = 1,
                delCmaxIn: float = 1, tauIn: float = 5, KIn: float = 1, 
                alphaIn: float = 2, betaIn: float = 2, muIn: float = 0.0, 
                zIn: np.array = np.array([0.2, 0.3, 0.3]), NIn: int = 100, 
                foodShort: float = 1, foodShortbegin: int = 8, foodShortend: int = 20, numRuns: int = 20,
                outputFileName: str = 'results.txt'):

    # define constants:
    gamma = gammaIn
    G = GIn
    Xmin = XminIn
    delSmax = delSmaxIn
    delCmax = delCmaxIn
    tau = tauIn
    K = KIn
    alpha = alphaIn
    beta = betaIn
    mu = muIn
    z = zIn
    N = NIn
    foodShortage = 1

    params = {
        'G': G,
        'Xmin': Xmin,
        'delSmax': delSmax,
        'delCmax': delCmax,
        'tau': tau,
        'K': K,
        'alpha': alpha,
        'beta': beta,
        'mu': mu,
        'z': z,
        'N': N,
    }

    #states being tracked
    Xhist = np.zeros((N, numRuns))
    Shist = np.zeros((3, N, numRuns))
    Chist = np.zeros((N, numRuns))
    Whist = np.zeros((N, numRuns))
    Wcuml = np.zeros((N, numRuns))

    delSmax = params['delSmax']
    delCmax = params['delCmax']
    tau = params['tau']
    K = params['K']
    alpha = params['alpha']
    beta = params['beta']
    mu = params['mu']
    z = params['z']
    N = params['N']

    for j in range(numRuns):

        Xhist[0, j] = 1
        Shist[:, 0, j] = np.array([1, 1, 1])
        Chist[0, j] = 1
        Whist[0, j] = 1
        Wcuml[0, j] = 1

        alive = True
        i = 0

        delSmax = params['delSmax']
        delCmax = params['delCmax']
        tau = params['tau']
        K = params['K']
        alpha = params['alpha']
        beta = params['beta']
        mu = params['mu']
        z = params['z']
        N = params['N']


        while alive and i < N - 1:
            #find beta for this timestep:
            beta_t = beta_dist.rvs(alpha, beta)
            #define food availability
            if foodShortbegin < i < foodShortend:
                foodShortage = foodShort
            else:
                foodShortage = 1

            F_t = 1
            E_t = tau * F_t * foodShortage

            X_t1, S_t1, C_t1, W_t1 = forwardModel(Xhist[i, j], beta_t, z, Shist[:, i, j], Chist[i, j], K, E_t, gamma, delCmax, delSmax, Xmin, G)
            Xhist[i + 1, j] = X_t1
            Shist[:, i + 1, j] = S_t1
            Chist[i + 1, j] = C_t1
            Whist[i + 1, j] = W_t1

            if np.random.rand() < mu or X_t1 < 0:
                alive = False

            Wcuml[i + 1, j] = Wcuml[i, j] + W_t1
            i += 1

    Xhist, XhistCon = convertToAverage(Xhist.tolist())
    Chist, ChistCon = convertToAverage(Chist.tolist())
    Whist, WhistCon = convertToAverage(Whist.tolist())
    Wcuml, WcumlCon = convertToAverage(Wcuml.tolist())
    ShistI, ShistConI = convertToAverage(Shist[0].tolist())
    ShistK, ShistConK = convertToAverage(Shist[1].tolist())
    ShistJ, ShistConJ = convertToAverage(Shist[2].tolist())

    results = {
        'Xhist': Xhist,
        'XhistCon': XhistCon,
        'Chist': Chist,
        'ChistCon': ChistCon,
        'Whist': Whist,
        'WhistCon': WhistCon,
        'Wcuml': Wcuml,
        'WcumlCon': WcumlCon,
        # Shist Graphs
        'ShistI': ShistI,
        'ShistConI': ShistConI,
        'ShistK': ShistK,
        'ShistConK': ShistConK,
        'ShistJ': ShistJ,
        'ShistConJ': ShistConJ,
    }
    # Write the JSON data to the file

    return results

def forwardModel(X_t, beta_t, z_t, S_t, C_t, K, E_t1, gamma_t, delCmax, delSmax, Xmin, G):
    def fitness_wrapped(delCS):
        return fitness_function(beta_t, z_t, S_t, C_t, K, X_t, E_t1, gamma_t, delCS, Xmin, G)

    bounds = [(-delSmax, delSmax), (-delSmax, delSmax), (-delSmax, delSmax), (-delCmax, delCmax)]
    result = minimize(fitness_wrapped, np.zeros(4), bounds=bounds)
    delMaxCS = result.x

    V_t = np.zeros_like(S_t)

    V_t[0] = ((S_t[0] + delMaxCS[0]) * (C_t + delMaxCS[3])) / (K + (C_t + delMaxCS[3]))
    V_t[1] = ((S_t[1] + delMaxCS[1]) * (C_t + delMaxCS[3])) / (K + (C_t + delMaxCS[3]))
    V_t[2] = ((S_t[2] + delMaxCS[2]) * (C_t + delMaxCS[3])) / (K + (C_t + delMaxCS[3]))

    X_t1 = X_t + E_t1 - np.dot(gamma_t, V_t)
    W_t1 = beta_t * (V_t[0]**z_t[0]) * (V_t[1]**z_t[1]) * (V_t[2]**z_t[2])

    S_t1 = S_t + delMaxCS[:3]
    C_t1 = C_t + delMaxCS[3]

    return X_t1, S_t1, C_t1, W_t1

def fitness_function(beta, z, S, C, K, X_t, E_t1, gamma, delCS, Xmin, G):
    V = np.zeros_like(S)

    V[0] = (S[0] + delCS[0]) * (C + delCS[3]) / (K + (C + delCS[3]))
    V[1] = (S[1] + delCS[1]) * (C + delCS[3]) / (K + (C + delCS[3]))
    V[2] = (S[2] + delCS[2]) * (C + delCS[3]) / (K + (C + delCS[3]))

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

    return -((W_t1**1) * (X_t1**3))

def convertToAverage(DataSet:list):
    confidenceInterval = [0] * len(DataSet)
    for i, row in enumerate(DataSet):
        print(row)
        confidenceInterval[i] += 2 * np.std(row)
        DataSet[i] = np.average(row)
    
    return DataSet, confidenceInterval

hormoneModelStatRun()


