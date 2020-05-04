const Pool = require('pg').Pool

let SQL = require('sql-template-strings')
let settings = require('./settings')

const pool = new Pool({
    user: settings.username,
    host: settings.host,
    database: settings.database,
    password: settings.password,
    port: settings.port,
})

/**
 * Authentication 
 */

const login = (request, response) => {
    const username = request.body.username
    const password = request.body.password

    pool.query('SELECT * FROM Users WHERE username = $1 AND password = $2', [username, password], (error, results) => {
        if (error) {
            response.status(500).send('An error occured.')
            return
        }
        response.status(200).json(results.rows)
    })
}

const register = (request, response) => {
    const { username, password, type } = request.body

    pool.query('INSERT INTO Users (username, password, type) VALUES ($1, $2, $3)',
        [username, password, type],
        (error, results) => {
            if (error) {
                response.status(500).send("An error has occured.")
                return
            }

            pool.query('SELECT uid FROM Users WHERE username = $1', [username], (error, results) => {
                if (error) {
                    response.status(500).send("An error has occured.")
                    return
                }
                response.status(201).json(results.rows)
            })
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
    const uid = parseInt(request.params.uid)

    pool.query('SELECT * FROM users WHERE uid = $1', [uid], (error, results) => {
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

const createCustomer = (request, response) => {
    const { cid, cname, creditcardnumber } = request.body

    pool.query('INSERT INTO Customers (cid, cname, creditcardnumber) VALUES ($1, $2, $3)',
        [cid, cname, creditcardnumber],
        (error, results) => {
            if (error) {
                response.status(500).send("An error has occured.")
                return
            }
            response.status(200).send("success")
        })
}

const getCustomerInfo = (request, response) => {
    const cid = parseInt(request.params.uid)

    pool.query('SELECT * FROM customers WHERE cid = $1', [cid], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const updateCreditCard = (request, response) => {
    const cid = parseInt(request.params.uid)
    const { cardNumber } = request.body

    pool.query(
        'UPDATE customers SET creditCardNumber = $1 WHERE cid = $2',
        [cardNumber, cid],
        (error, results) => {
            if (error) {
                throw error
            }
            // do something with response
            response.status(200).send(`User credit card modified with ID: ${cid}`)
        })
}

/**
 * Restaurants
 */

const getRestaurants = (request, response) => {
    pool.query('SELECT * FROM Restaurants', (error, results) => {
        if (error) {
            response.status(500).send("An error has occured.")
            return
        }
        response.status(200).send(results.rows)
    })
}

const createRestaurant = (request, response) => {
    const { restaurantid, restaurantname, minorder, deliveryfee } = request.body

    pool.query('INSERT INTO Restaurants (restaurantid, restaurantname, minorder, deliveryfee) VALUES ($1, $2, $3, $4)',
        [restaurantid, restaurantname, minorder, deliveryfee],
        (error, results) => {
            if (error) {
                response.status(500).send("An error has occured.")
                return
            }
            response.status(200).send("success")
        })
}

const getRestaurantInfo = (request, response) => {
    const restaurantId = parseInt(request.params.uid)

    pool.query('SELECT * FROM restaurants WHERE restaurantid = $1', [restaurantId], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const updateRestaurantMinOrder = (request, response) => {
    const restaurantId = parseInt(request.params.uid)
    const { minOrder } = request.body

    pool.query('UPDATE restaurants SET minOrder = $1 WHERE restaurantId = $2',
        [minOrder, restaurantId],
        (error, results) => {
            if (error) {
                throw error
            }
            // do something with response
            response.status(200).send(`Restaurant with ID: ${restaurantId} updated min order to ${minOrder}`)
        })
}

/**
 * Riders
 */

const createRider = (request, response) => {
    const { riderid, parttime } = request.body

    pool.query('INSERT INTO Riders (riderId, parttime) VALUES ($1, $2)',
        [riderid, parttime],
        (error, results) => {
            if (error) {
                response.status(500).send("An error has occured.")
                return
            }
            response.status(200).send("success")
        })
}

const getRiderInfo = (request, response) => {
    const riderId = parseInt(request.params.uid)

    pool.query('SELECT * FROM RiderDashboardInfo WHERE riderId = $1', [riderId], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getRiderOrders = (request,response) => {
    const riderId = parseInt(request.params.uid)

    pool.query('SELECT * FROM RiderDashboardOrders WHERE riderId = $1', [riderId], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

/**
 * Menu
 */

const getMenu = (request, response) => {
    pool.query('SELECT * FROM Menu', (error, results) => {
        if (error) {
            response.status(500).send("An error has occured.")
            return
        }
        response.status(200).send(results.rows)
    })
}

const getMenuForRestaurant = (request, response) => {
    const restaurantname = request.params.restaurantname
    pool.query('SELECT * FROM menu M, restaurants R WHERE R.restaurantid = M.restaurantid AND R.restaurantname = $1', 
        [restaurantname], (error, results) => {
        if (error) {
            response.status(500).send("An error has occured with Menu loading.")
            return
        }
        response.status(200).json(results.rows)
    })
}

const getItemInfo = (request, response) => {
    const restaurantname = request.params.restaurantname
    const fooditemname = request.params.item
    pool.query('SELECT price FROM menu M, restaurants R WHERE R.restaurantid = M.restaurantid AND R.restaurantname = $1 AND M.foodname = $2', 
        [restaurantname, fooditemname], (error, results) => {
        if (error) {
            response.status(500).send("An error has occured.")
            return
        }
        response.status(200).json(results.rows)
    })
}

const getMenuInfo = (request, response) => {
    const restaurantId = parseInt(request.params.uid)

    pool.query('SELECT foodname, price, category, maxavailable FROM menu WHERE restaurantId = $1', [restaurantId], (error, results) => {
        if (error) {
            response.status(500).send("An error has occured.")
            return
        }
        response.status(200).json(results.rows)
    })
}

const addMenuItem = (request, response) => {
    const { restaurantid, foodName, price, maxAvailable, category } = request.body

    pool.query('INSERT INTO Menu (restaurantid, foodname, price, maxAvailable, category) VALUES ($1, $2, $3, $4, $5)',
        [parseInt(restaurantid), foodName, price, parseInt(maxAvailable), category],
        (error, results) => {
            if (error) {
                response.status(500).send(error.message)
                return
            }
            response.status(200).send("success")
            
        })
}

const updateMenuItem = (request, response) => {
    const foodName = request.params.foodName
    const { restaurantid,newFoodName, newPrice, newMaxAvailable, newCategory } = request.body

    pool.query('UPDATE menu SET foodname = $2, price = $3, maxAvailable = $4, category = $5 WHERE foodname = $6 AND restaurantid = $1',
        [parseInt(restaurantid), newFoodName, newPrice, parseInt(newMaxAvailable), newCategory, foodName],
        (error, results) => {
            if (error) {
                response.status(500).send(error.message)
                return
            } 
            response.status(200).send(`success`)
            
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
    const orderId = parseInt(request.params.orderId)

    pool.query('SELECT * FROM reviews WHERE orderId = $1', [orderId], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
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
const getOrders = (request, response) => {
    pool.query('SELECT * FROM Orders', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getOrder = (request, response) => {
    const orderId = parseInt(request.params.orderId)

    pool.query('SELECT * FROM Orders WHERE orderId = $1', [orderId], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
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
    const orderId = parseInt(request.params.orderId)

    pool.query('SELECT * FROM OrderTimes WHERE orderId = $1', [orderId], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
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
    const riderId = parseInt(request.params.uid)

    pool.query('SELECT * FROM WWS WHERE riderId = $1', [riderId], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
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
    const riderId = parseInt(request.params.uid)

    pool.query('SELECT * FROM MWS WHERE riderId = $1', [riderId], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
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
    const cid = parseInt(request.params.uid)

    pool.query('SELECT * FROM Orders WHERE cid = $1', [cid], (error, results) => {
        if (error) {
            response.status(500).send("An error has occured.")
            return
        }
        response.status(200).json(results.rows)
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
    const restId = parseInt(request.params.uid)
    var query = (SQL
                `select date_part('month', timeRiderDelivered) as month, count(distinct orderId) as totalOrders, SUM(price) as totalCost
                from completedOrders
                where restaurantId = $1
                group by month
                order by month DESC;`
                )
    pool.query(query,[restId], (error, results) => {    
        if (error) {
            console.log(error)
            response.status(500).send(error.message)
            return
        } 
        response.status(200).json(results.rows)
    })
}


module.exports = {
    login,
    register,

    getAllUsers,
    getUserById,
    updateUser,

    createCustomer,
    getCustomerInfo,
    updateCreditCard,

    getRestaurants,
    createRestaurant,
    getRestaurantInfo,
    updateRestaurantMinOrder,

    createRider,
    getRiderInfo,
    getRiderOrders,

    getMenu,
    getMenuForRestaurant,
    getItemInfo,
    getMenuInfo,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,

    getReviews,
    addReview,

    getOrders,
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
