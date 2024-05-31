import numpy as np
from scipy.optimize import minimize
from scipy.stats import beta as beta_dist

def rundelSmaxStudy():
    # define constants:
    gamma = np.array([0.5, 1, 2])
    G = 0.01
    Xmin = 1
    delSmax = np.linspace(0.1, 10, 20)
    delCmax = 1
    tau = 1
    K = 1
    alpha = 5
    beta = 1
    mu = 0.01
    z = np.array([0.1, 0.2, 0.3])
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
        Shist[:, 0, j] = np.array([1, 1, 1])
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

            X_t1, S_t1, C_t1, W_t1 = forwardModel(Xhist[0, i, j], beta_t, z, Shist[:, i, j], Chist[0, i, j], K, E_t, gamma, delCmax, delSmax[j], Xmin, G)
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

rundelSmaxStudy()
