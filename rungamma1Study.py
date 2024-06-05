import numpy as np
from scipy.optimize import minimize
from scipy.stats import beta as beta_dist

def rungamma1Study():
    # define constants:
    gamma = [np.linspace(0.1, 10, 20), 1, 2]
    G = 0.01
    Xmin = 1
    delSmax = 1
    delCmax = 1
    tau = 1
    K = 1
    alpha = 5
    beta = 1
    mu = 0.01
    z = [0.1, 0.2, 0.3]
    N = 20

    # states being tracked
    Xhist = np.zeros((1, N, 20))
    Shist = np.zeros((3, N, 20))
    Chist = np.zeros((1, N, 20))
    Whist = np.zeros((1, N, 20))
    Wcuml = np.zeros((1, N, 20))

    for j in range(20):
        # populate with initial conditions
        Xhist[0, 0, j] = 1
        Shist[:, 0, j] = [1, 1, 1]
        Chist[0, 0, j] = 1
        Whist[0, 0, j] = 1
        alive = True
        i = 0

        while alive and i < N - 1:
            # find beta for this timestep:
            beta_t = beta_dist.rvs(alpha, beta)
            # define food availability
            F_t = 1
            E_t = tau * F_t

            X_t1, S_t1, C_t1, W_t1 = forwardModel(Xhist[0, i, j], beta_t, z, Shist[:, i, j], Chist[0, i, j], K, E_t, gamma[j], delCmax, delSmax, Xmin, G)
            Xhist[0, i + 1, j] = X_t1
            Shist[:, i + 1, j] = S_t1
            Chist[0, i + 1, j] = C_t1
            Whist[0, i + 1, j] = W_t1

            if np.random.rand() < mu or X_t1 < 0:
                alive = False

            Wcuml[0, i + 1, j] = Wcuml[0, i, j] + W_t1
            i += 1

    return Xhist, Shist, Chist, Whist, Wcuml

def forwardModel(X_t, beta_t, z_t, S_t, C_t, K, E_t1, gamma_t, delCmax, delSmax, Xmin, G):
    bounds = [(-delSmax, delSmax), (-delSmax, delSmax), (-delCmax, delCmax)]
    delMaxCS = minimize(lambda x: fitness(beta_t, z_t, S_t, C_t, K, X_t, E_t1, gamma_t, x, Xmin, G), [0, 0, 0, 0], bounds=bounds)
    
    for i in range(3):
        if S_t[i] + delMaxCS[i] < 0:
            delMaxCS[i] = -S_t[i]

    V_t = np.zeros_like(S_t)
    for i in range(3):
        V_t[i] = (S_t[i] + delMaxCS[i]) * (C_t + delMaxCS[3]) / (K + (C_t + delMaxCS[3]))

    X_t1 = X_t + E_t1 - np.dot(gamma_t, V_t)
    W_t1 = beta_t * np.prod([V_t[i]**z_t[i] for i in range(3)])

    S_t1 = S_t + delMaxCS[:3]
    C_t1 = C_t + delMaxCS[3]

    return X_t1, S_t1, C_t1, W_t1

def fitness(beta, z, S, C, K, X_t, E_t1, gamma, delCS, Xmin, G):
    V = np.zeros_like(S)
    for i in range(3):
        V[i] = (S[i] + delCS[i]) * (C + delCS[3]) / (K + (C + delCS[3]))
        if S[i] + delCS[i] < 0:
            V[i] = 0

    W_t1 = beta * np.prod([abs(V[i])**z[i] for i in range(3)])
    X_t1 = X_t + E_t1 - np.dot(gamma, V)

    if X_t1 < Xmin or any(V[i] < G for i in range(3)):
        W_t1 = 0

    return -abs(W_t1)**3 * abs(X_t1)**0.01


