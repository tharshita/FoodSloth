const Pool = require('pg').Pool
const pool = new Pool({
  user: 'harshita',
  host: 'localhost',
  database: 'project',
  password: 'sql',
  port: 5432,
})

/**
 * Authentication 
 */

const login = (request, response) => {
  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const register = (request, response) => {
  const { name, username, password, type } = request.body

  pool.query('INSERT INTO Users (name, username, password, type) VALUES ($1, $2, $3, $4)', 
  [name, username, password, type], 
  (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${result.insertId}`)
  })
}


/**
 * Users
 */
 
const getAllUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY uid ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE uid = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const updateUser = (request, response) => {
  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

/**
 * Customers
 */

const getCustomerInfo = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const updateCreditCard = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

/**
 * Restaurants
 */

const getRestaurantInfo = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const updateRestaurantMinOrder = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

/**
 * Riders
 */

const getRiderInfo = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

/**
 * Menu
 */

const getMenuInfo = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const addMenuItem = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const updateMenuItem = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const deleteMenuItem = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

/**
 * Reviews
 */

const getReviews = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const addReview = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

/**
 * Orders
 */
const getOrder = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const createNewOrder = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const updateOrderWithRiderInfo = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

/**
 * Customer Promos
 */

const checkCustomerPromoEligibility = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const addCustomerPromo = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const updateCustomerPromo = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

/**
 * Restaurant Promos
 */

const checkRestaurantPromoEligibility = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const addRestaurantPromo = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const updateRestaurantPromo = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

/**
 * Order Timings
 */

const getOrderTimes = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const updateOrderPlaced = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const updateRiderDeparts = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const updateRiderArrives = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const updateRiderCollects = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const updateRiderDelivers = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

/**
 * Hours
 */
const getWWSRiderHours = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const addWWSRiderHours = (request, response) => {
  const { username, password, type } = request.body

  pool.query('INSERT INTO Users (username, password, type) VALUES ($1, $2, $3)', [username, password, type], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${result.insertId}`)
  })
}

const getMWSRiderHours = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const addMWSRiderHours = (request, response) => {
  const { username, password, type } = request.body

  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

/**
 * Statistics
 */

const getNewCustomerStatistic = (request, response) => {
  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const getNewOrderStatistic = (request, response) => {
  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const getTotalOrderCostStatistic = (request, response) => {
  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const getOrdersPerCustomer = (request, response) => {
  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const getOrdersPerLocation = (request, response) => {
  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const getRiderOrdersStatistic = (request, response) => {
  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const getRiderHoursWorked = (request, response) => {
  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const getRiderSalaries = (request, response) => {
  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const getRiderAvgDeliveryTime = (request, response) => {
  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const getRiderRatings = (request, response) => {
  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const getRiderSummary = (request, response) => {
  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}

const getRestaurantOrderStatistic = (request, response) => {
  pool.query('', (error, results) => {
    if (error) {
      throw error
    }
    // do something with response
  })
}


module.exports = {
  login,
  register,

  getAllUsers,
  getUserById,
  updateUser,

  getCustomerInfo,
  updateCreditCard,

  getRestaurantInfo,
  updateRestaurantMinOrder,

  getRiderInfo,

  getMenuInfo,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,

  getReviews,
  addReview,

  getOrder,
  createNewOrder,
  updateOrderWithRiderInfo,

  checkCustomerPromoEligibility,
  addCustomerPromo,
  updateCustomerPromo,

  checkRestaurantPromoEligibility,
  addRestaurantPromo,
  updateRestaurantPromo,

  getOrderTimes,
  updateOrderPlaced,
  updateRiderDeparts,
  updateRiderArrives,
  updateRiderCollects,
  updateRiderDelivers,

  getWWSRiderHours,
  addWWSRiderHours,
  getMWSRiderHours,
  addMWSRiderHours,

  getNewCustomerStatistic,
  getNewOrderStatistic,
  getTotalOrderCostStatistic,
  getOrdersPerCustomer,
  getOrdersPerLocation,
  getRiderOrdersStatistic,
  getRiderHoursWorked,
  getRiderSalaries,
  getRiderAvgDeliveryTime,
  getRiderRatings,
  getRiderSummary,
  getRestaurantOrderStatistic
}
