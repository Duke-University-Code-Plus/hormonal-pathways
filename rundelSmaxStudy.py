import numpy as np
from scipy.optimize import minimize
from scipy.stats import beta as beta_dist


def rundelSmaxStudy(gammaIn : np.array = np.array([0.5, 1, .2]), GIn : float = float(0.01), XminIn : float = float(1), delSmaxIn : np.array = np.linspace(0.1, 10, 20), delCmaxIn : float = float(1), tauIn : float = float(5), KIn : float = float(1), alphaIn : float = float(5), betaIn : float = float(1), muIn : float = float(0.01), zIn : np.array = np.array([0.1, 0.2, 0.3]), NIn : int = 20, foodShort : int = 0.5, foodShortbegin : int = 8, foodShortend : int = 10, F_tIn : float = float(1)):
    """
    simulates and returns the data of accumulated fitness (an individual organism's reproductive success) as well as the history of its energy state, ciculating hormone level, receptor sensitivity, and expected reproductive success at each time stamp. 

    Parameters: 
    * variable including "In" represents an input, not repeated to avoid redundancy
    gamma (numpy array) - degree of selected trait values (Vi,t) from the previous time step with costly behaviors 
    G (float) - minimium availability of mature gametes for reproductive success
    Xmin (float) - minimium energy reserves for an organism's reproductive success
    delSmax (numpy array) - maximum change of receptor sensitivity at a given target for a single time step
    delCmax (numpy array) - maximum change of circulating hormone level at a given target for a single time step
    tau (float) - food avilability 
    K (float) - affinity of each receptor to a hormone signal
    alpha (float) - minimum possible environmental variability 
    beta (float) - maximum possible environmental variability 
    mu (float) - mortality probabilty 
    z (numpy array) - selection index (weight) on trait i 
    N (int) - number of reproductive cycles 
    foodShort (int) - ??? 
    foodBegin (int) - beginning reproductive cycle of food shortage 
    foodEnd (int) - ending reproductive cycle of food shortage 
    F_t (float) - effort in foraging and feeding 

    returns: 
    Xhist (tuple) - array representing history an organism's energy state at each times step
    Shist (tuple) - array representing history an organism's receptor sensitivity at each times step
    Chist (tuple) - array representing history an organism's ciculating hormone level at each times step
    Whist (tuple) - array representing history an organism's expected reproductive success at each times step
    Wcuml (tuple) - array representing accumulated fitness (an individual organism's reproductive success) at each times step
    """
    # checks whether inputs are of the correct type and within acceptable ranges
    if not isinstance(gammaIn, np.ndarray):
        raise TypeError('gammaIn must be a numpy array')
    if not isinstance(GIn, float):
        raise TypeError('GIn must be a float')
    if not isinstance(XminIn, float):
        raise TypeError('XminIn must be a float')
    if not isinstance(delSmaxIn, np.ndarray):
        raise TypeError('delSmaxIn must be a numpy array')
    if not isinstance(delCmaxIn, float):
        raise TypeError('delCmaxIn must be a float')
    if not isinstance(tauIn, float):
        raise TypeError('tauIn must be a float')
    if not isinstance(KIn, float):
        raise TypeError('KIn must be a float')
    if not isinstance(alphaIn, float):
        raise TypeError('alphaIn must be a float')
    if not isinstance(betaIn, float):
        raise TypeError('betaIn must be a float')
    if not isinstance(muIn, float):
        raise TypeError('muIn must be a float')
    if not isinstance(zIn, np.ndarray):
        raise TypeError('zIn must be a numpy array')
    if not isinstance(NIn, int):
        raise TypeError('NIn must be an integer')
    if not isinstance(foodShort, float):
        raise TypeError('foodShort must be a float')
    if not isinstance(foodShortbegin, int):
        raise TypeError('foodShortbegin must be an integer')
    if not isinstance(foodShortend, int):
        raise TypeError('foodShortend must be an integer')
    if not isinstance(F_tIn, float):
        raise TypeError('F_tIn must be a float')
    if not len(gammaIn) == 3:
        raise ValueError('gammaIn must have length 3')
    if not 0 <= GIn <= 1:
        raise ValueError('GIn must be between 0 and 1')
    if not XminIn > 0:
        raise ValueError('XminIn must be greater than 0')
    if not delSmaxIn.all() > 0:
        raise ValueError('delSmaxIn must be greater than 0')
    if not delCmaxIn > 0:
        raise ValueError('delCmaxIn must be greater than 0')
    if not tauIn > 0:
        raise ValueError('tauIn must be greater than 0')
    if not KIn > 0:
        raise ValueError('KIn must be greater than 0')
    if not alphaIn > 0:
        raise ValueError('alphaIn must be greater than 0')
    if not betaIn > 0:
        raise ValueError('betaIn must be greater than 0')
    if not 0 <= muIn <= 1:
        raise ValueError('muIn must be between 0 and 1')
    if not len(zIn) == 3:
        raise ValueError('zIn must have length 3')
    if not NIn > 0:
        raise ValueError('NIn must be greater than 0')
    if not 0 <= foodShort <= 1:
        raise ValueError('foodShort must be between 0 and 1')
    if not foodShortbegin >= 0:
        raise ValueError('foodShortbegin must be greater than or equal to 0')
    if not foodShortend >= 0:
        raise ValueError('foodShortend must be greater than or equal to 0')
    if not F_tIn > 0:
        raise ValueError('F_tIn must be greater than 0')
    if not foodShortbegin < foodShortend:
        raise ValueError('foodShortbegin must be less than foodShortend')
    if not 0 <= foodShortbegin < NIn:
        raise ValueError('foodShortbegin must be between 0 and NIn')
    if not 0 <= foodShortend < NIn:
        raise ValueError('foodShortend must be between 0 and NIn')
    
    # define constants based on inputs
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

    #initialize the arrays (set length and step) to store the history of state variables at appropriate reproductive cycles
    Xhist = np.zeros((1, N, 20))
    Shist = np.zeros((3, N, 20))
    Chist = np.zeros((1, N, 20))
    Whist = np.zeros((1, N, 20))
    Wcuml = np.zeros((1, N, 20))

    for j in range(20):
        # populate with initial conditions
        Xhist[0, 0, j] = 1
        #the receptor sensitivity is monitored in three target tissues 
        Shist[:, 0, j] = np.array([1, 1, 1])
        Chist[0, 0, j] = 1
        Whist[0, 0, j] = 1
        #initialize the organizm's survival state
        alive = True
        #initialize current reproductive cycle
        i = 0

        while alive and i < N - 1:
            # find random variable that reflects environmental variability 
            beta_t = beta_dist.rvs(alpha, beta)
            F_t = 1
            #integrate food shortage
            if foodShortbegin < i < foodShortend:
                F_t = foodShort
            else:
                F_t = F_tIn
            #find energy increment of an organism from foraged food
            E_t = tau * F_t

            #call the forwardModel function and increment the reproductive cycle by 1 
            X_t1, S_t1, C_t1, W_t1 = forwardModel(Xhist[0, i, j], beta_t, z, Shist[:, i, j], Chist[0, i, j], K, E_t, gamma, delCmax, delSmax[j], Xmin, G)
            Xhist[0, i + 1, j] = X_t1
            Shist[:, i + 1, j] = S_t1
            Chist[0, i + 1, j] = C_t1
            Whist[0, i + 1, j] = W_t1

            #if an organism's random value falls victim to the mortality rate or 
            #if its energy state is zero or below, initialize the organism as unalive
            if np.random.rand() < mu or X_t1 < 0:
                alive = False

            #increment the reproductive success accrued to Wcuml
            Wcuml[0, i + 1, j] = Wcuml[0, i, j] + W_t1
            #increment the reproductive cycle
            i += 1

    return Xhist, Shist, Chist, Whist, Wcuml


def forwardModel(X_t, beta_t, z_t, S_t, C_t, K, E_t1, gamma_t, delCmax, delSmax, Xmin, G):
    """
    Simulates the dynamic state model with an organism's state variables to retrieve the values for the next time step.
    
    Parameters:
    *not included for the sake of redundancy. the parameter descriptions are repeated in delSmaxStudy function.
    returns: 
    X_t1 - energy reserve for the time step 
    S_t1 - receptor sensitivity for the time step 
    C_t1 - circulating hormone level for the time step 
    W_t1 - reproductive success for the time step 
    """
    #define fitness function
    def fitness(delCS):
        return -fitness_function(beta_t, z_t, S_t, C_t, K, X_t, E_t1, gamma_t, delCS, Xmin, G)
    
    #set the bounds for the changes of maximum receptor sensitivity and circulated hormonal level
    bounds = [(-delSmax, delSmax), (-delSmax, delSmax), (-delSmax, delSmax), (-delCmax, delCmax)]

    #retrieves the optimal values of changes in receptor sensitivity and circulating hormone level
    #that minimizes the negative of the fitness function
    result = minimize(fitness, [0, 0, 0, 0], bounds=bounds)
    delMaxCS = result.x

    #finds the maximum changes in receptor sensitivity and circulating hormone level 
    #that optimizes the organism's fitness.
    delMaxCS[0] = max(delMaxCS[0], -S_t[0])
    delMaxCS[1] = max(delMaxCS[1], -S_t[1])
    delMaxCS[2] = max(delMaxCS[2], -S_t[2])

    #calculates the expected fitness payoffs with the optimal S_t and C_t values for the time step
    V_t = np.zeros_like(S_t)
    V_t[0] = (S_t[0] + delMaxCS[0]) * (C_t + delMaxCS[3]) / (K + (C_t + delMaxCS[3]))
    V_t[1] = (S_t[1] + delMaxCS[1]) * (C_t + delMaxCS[3]) / (K + (C_t + delMaxCS[3]))
    V_t[2] = (S_t[2] + delMaxCS[2]) * (C_t + delMaxCS[3]) / (K + (C_t + delMaxCS[3]))

    #calculate the expected energy reserve for the time step
    X_t1 = X_t + E_t1 - np.dot(gamma_t, V_t)
    #calculate the expected reproductive success for the time step
    W_t1 = beta_t * (V_t[0] ** z_t[0]) * (V_t[1] ** z_t[1]) * (V_t[2] ** z_t[2])

    #update the receptor sensitivity for the next time step
    S_t1 = S_t + delMaxCS[:3]
    #update the circulating hormone level for the next time step
    C_t1 = C_t + delMaxCS[3]

    return X_t1, S_t1, C_t1, W_t1


def fitness_function(beta, z, S, C, K, X_t, E_t1, gamma, delCS, Xmin, G):
    """
    Outputs the fitness from a single time step.

    Parameters:
    *not included for the sake of redundancy. the parameter descriptions are repeated in delSmaxStudy function.
    """
    #create and initialize the trait value as an array (for each target tissue), as done in Shist 
    V = np.zeros_like(S)

    #calculate the fitness payoffs of the reproductive cycle with the Michaelis Menten Equation for 
    #mating effort, gamete maturation, and parental effort
    V[0] = (S[0] + delCS[0]) * (C + delCS[3]) / (K + (C + delCS[3]))
    V[1] = (S[1] + delCS[1]) * (C + delCS[3]) / (K + (C + delCS[3]))
    V[2] = (S[2] + delCS[2]) * (C + delCS[3]) / (K + (C + delCS[3]))

    #set all negative trait values to 0 
    V[V < 0] = 0

    #calculate the expected reproductive success of the cycle using with the fitness function 
    W_t1 = beta * (abs(V[0]) ** z[0]) * (abs(V[1]) ** z[1]) * (abs(V[2]) ** z[2])
    #calculate the energy reserve of the organism 
    X_t1 = X_t + E_t1 - np.dot(gamma, V)

    #if the energy reserve or gamete maturation does not meet its set minimum requirement, 
    #initialize the expected reproductive success (W_t1) to zero, as successful mating effor does not occur
    if X_t1 < Xmin or any(V < G):
        W_t1 = 0

    #combines the effects of reproductive success and energy state 
    #to calculate a value that represnts fitness that may be optimized 
    return -(abs(W_t1) ** 3) * (abs(X_t1) ** 0.01)

rundelSmaxStudy()

