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

const getAddress = (request, response) => {
    const uid = parseInt(request.params.uid)

    pool.query('SELECT * FROM addresses WHERE uid = $1', [uid], (error, results) => {
        if (error) {
            response.status(500).send(error.message)
            return
        }
        response.status(200).send(results.rows)
    })
}

const updateAddress = (request, response) => {
    const { uid, area, addresstext, postalcode } = request.body

    pool.query('UPDATE addresses SET area = $1, addresstext = $2, postalcode = $3 WHERE uid = $4', 
    [area, addresstext, postalcode, uid], (error, results) => {
            if (error) {
                response.status(500).send(error.message)
                return
            }
            response.status(200).send("success")
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
                response.status(500).send(error.message)
                return
            }
            response.status(200).send("success")
        })
}

const getCustomerOrders = (request, response) => {
    const cid = parseInt(request.params.uid)

    var query = (SQL 
        `
        select orderid, restaurantname, addresstext, postalcode
        from Orders O, Restaurants R, Addresses A
        where O.cid = $1
        and R.restaurantId = O.restaurantId
        and O.aid = A.aid;`
    )
    
    pool.query(query, [cid], (error, results) => {
        if (error) {
            response.status(500).send("An error has occured.")
            return
        }
        response.status(200).json(results.rows)
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

const getCustomerAddress = (request, response) => {
    const cid = parseInt(request.params.uid)

    pool.query('SELECT * FROM addresses A WHERE A.uid = $1', [cid],
    (error, results) => {
        if (error) {
            response.status(500).send("An error has occured.")
            return
        }
        response.status(200).json(results.rows)
    })
}

const updateCreditCard = (request, response) => {
    const cid = parseInt(request.params.uid)
    const cardNumber = parseInt(request.body.cardNumber)

    pool.query(
        'UPDATE Customers SET creditCardNumber = $1 WHERE cid = $2',
        [cardNumber, cid],
        (error, results) => {
            if (error) {
                response.status(500).send(error.message)
                return
            }
            response.status(200).send(`User credit card modified with ID: ${cid}`)
        })
}

const updateCustomerReward = (request, response) => {
    const cid = parseInt(request.params.uid)
    const { rewardpoints } = request.body

    pool.query('UPDATE Customers SET rewardpoints = rewardpoints + $1 WHERE cid = $2 RETURNING rewardpoints',
    [rewardpoints, cid],
    (error, results) => {
        if (error) {
            response.status(500).send(error.message)
            return
        }
        response.status(200).json(results.rows)
    })
}

const customerAddAddress = (request, response) => {
    const { uid, area, addressText, postalCode } = request.body

    pool.query('INSERT INTO Addresses(uid, area, addressText, postalCode) VALUES ($1, $2, $3, $4)', 
        [parseInt(uid), area, addressText, parseInt(postalCode)],
        (error, results) => {
            if (error) {
                response.status(500).send(error.message)
                return
            }
            response.status(200).send("success")
            
        })
}

const getPastOrders = (request, response) => {
    const cid = parseInt(request.params.uid)

    var query = (SQL
        `SELECT C.orderid, date_trunc('day', C.timeRiderDelivered)::date as date, C.rider, SUM(C.price * C.quantity) as totalCost, R.restaurantname
        FROM CompletedOrders C inner join Restaurants R using (restaurantid)
        WHERE C.cid = $1
        GROUP BY C.orderid, date, C.rider, R.restaurantname;`
        )

    pool.query(query, [cid], (error, results) => {
        if (error) {
            response.status(500).send(error.message)
            return
        }
        response.status(200).json(results.rows)
    })
}

const getPastItems = (request, response) => {
    const cid = parseInt(request.params.uid)
    const oid = parseInt(request.params.oid)

    var query = (SQL
        `SELECT foodname, quantity, price
        FROM CompletedOrders 
        WHERE cid = $1
        AND orderid = $2;`
        )

    pool.query(query, [cid, oid], (error, results) => {
        if (error) {
            response.status(500).send(error.message)
            return
        }
        response.status(200).json(results.rows)
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
    const { restaurantid, restaurantname, minorder, deliveryfee, area, addresstext, postalcode } = request.body

    pool.query('INSERT INTO Restaurants (restaurantid, restaurantname, minorder, deliveryfee) VALUES ($1, $2, $3, $4)',
        [restaurantid, restaurantname, minorder, deliveryfee],
        (error, results) => {
            if (error) {
                console.log("fail1")
                console.log(error)
                response.status(500).send("An error has occured.")
                return
            }

            pool.query('INSERT INTO Addresses (uid, area, addresstext, postalcode) VALUES($1, $2, $3, $4)', 
            [restaurantid, area, addresstext, postalcode], 
            (error, results) => {
                if (error) {
                    console.log("fail2")
                    console.log(error)
                    response.status(500).send("An error has occured.")
                }
                response.status(200).send("success")
            })
        })
}

const getRestaurantInfo = (request, response) => {
    const restaurantId = parseInt(request.params.uid)

    pool.query('SELECT * FROM restaurants WHERE restaurantid = $1', [restaurantId], (error, results) => {
        if (error) {
            response.status(500).send("An error has occured.")
            return
        }
        response.status(200).json(results.rows)
    })
}

const updateRestaurantMinOrder = (request, response) => {
    const restaurantId = parseInt(request.params.uid)
    const { newMinOrder } = request.body

    pool.query('UPDATE restaurants SET minOrder = $1 WHERE restaurantId = $2',
        [parseInt(newMinOrder), restaurantId],
        (error, results) => {
            if (error) {
                response.status(500).send("An error has occured.")
                return
            }
            // do something with response
            response.status(200).send(`Restaurant with ID: ${restaurantId} updated min order to ${newMinOrder}`)
        })
}

const updateRestaurantDeliveryFee = (request, response) => {
    const restaurantId = parseInt(request.params.uid)
    const { newDeliveryFee } = request.body

    pool.query('UPDATE restaurants SET deliveryfee = $1 WHERE restaurantId = $2',
        [parseInt(newDeliveryFee), restaurantId],
        (error, results) => {
            if (error) {
                response.status(500).send("An error has occured.")
                return
            }
            response.status(200).send(`Restaurant with ID: ${restaurantId} updated delivery fee to ${newDeliveryFee}`)
        })
}

const findRestaurant = (request, response) => {
    const restaurantname = request.params.restaurantname

    pool.query('SELECT * FROM Restaurants WHERE restaurantname = $1', [restaurantname], 
        (error, results) => {
            if (error) {
                response.status(500).send("An error has occured.")
                return
            }
            response.status(200).json(results.rows)
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

const getRiderCurrentOrders = (request, response) => {
    const riderId = parseInt(request.params.uid)
    const complete = 'complete'

    pool.query('SELECT * FROM RiderOrders WHERE riderId = $1 AND status <> $2', [riderId, complete], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getRiderPastOrders = (request,response) => {
    const riderId = parseInt(request.params.uid)
    const complete = 'complete'

    pool.query('SELECT * FROM RiderOrders WHERE riderId = $1 AND status = $2', [riderId, complete], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getFulltimeRiderHours = (request, response) => {
    const riderId = parseInt(request.params.uid)

    pool.query('SELECT * FROM mws WHERE riderId = $1', [riderId], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getParttimeRiderHours = (request, response) => {
    const riderId = parseInt(request.params.uid)

    pool.query('SELECT * FROM WWS WHERE riderId = $1', [riderId], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const setFulltimeRiderDay = (request, response) => {
    const { riderid, startday } = request.body

    var query = (SQL
        `INSERT INTO mws (riderid, startday, shift)
            VALUES ($1, $2, 1)
            ON CONFLICT(riderid) DO UPDATE
                SET startday = $2;`
        )

    pool.query(query, [riderid, startday], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send("success")
    })
}

const setFulltimeRiderShift = (request, response) => {
    const { riderid, shift } = request.body

    var query = (SQL
        `INSERT INTO mws (riderid, startday, shift)
            VALUES ($1, 1, $2)
            ON CONFLICT(riderid) DO UPDATE
                SET shift = $2;`
        )

    pool.query(query, [riderid, shift], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send("success")
    })
}

const addParttimeSlot = (request, response) => {
    const { riderid, day, hourstart, hourend } = request.body

    pool.query('INSERT INTO wws VALUES($1, $2, $3, $4)', [riderid, day, hourstart, hourend], (error, result) => {
        if (error) {
            response.status(500).send(error.message)
            console.log(error.message)
            return
        }
        response.status(200).send("success")
    })
}

const deleteParttimeSlot = (request, response) => {
    const { riderid, day, hourstart, hourend } = request.body

    pool.query('DELETE FROM wws WHERE riderid = $1 AND day = $2 AND hourstart = $3 AND hourend = $4', [riderid, day, hourstart, hourend], (error, result) => {
        if (error) {
            response.status(500).send(error.message)
            console.log(error.message)
            return
        }
        response.status(200).send("success")
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

const checkItemAvail = (request, response) => {
    const restaurantname = request.params.restaurantname
    const item = request.params.item

    pool.query('SELECT maxavailable FROM menu M, restaurants R WHERE R.restaurantid = M.restaurantid AND R.restaurantname = $1 AND M.foodname = $2', 
        [restaurantname, item], (error, results) => {
        if (error) {
            response.status(500).send("An error has occured.")
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

const updateMenuItemQuant = (request, response) => {
    const foodid = parseInt(request.params.foodid)
    const { restaurantId, quant } = request.body

    pool.query('UPDATE Menu SET maxAvailable = maxAvailable - $1 WHERE foodId = $2 AND restaurantId = $3', 
    [parseInt(quant), foodid, parseInt(restaurantId)],
        (error, results) => {
        if (error) {
            response.status(500).send(error.message)
            return
        } 
        response.status(200).json(results.rows)
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
    const { orderId, rating, review } = request.body

    pool.query('INSERT INTO reviews (orderid, rating, review) VALUES ($1, $2, $3)',
    [orderId, rating, review], (error, results) => {
        if (error) {
            response.status(500).send(error.message)
        }
        response.status(200).send("success")
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
    var { cid, restaurantId, riderId, aid, deliveryFee, byCash, creditCardNumber, Promo } 
        = request.body
    let cash = false;
    if ((request.body.byCash.toLowerCase() === 'true')) {
        cash = true;
        creditCardNumber = null;
    }

    var query = (SQL 
    `INSERT INTO Orders (cid, restaurantId, riderId, aid, deliveryFee, byCash, 
        creditCardNumber, promo) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING orderId`)

    pool.query(query, [cid, restaurantId, null, aid, deliveryFee, cash, 
                        creditCardNumber, null], 
        (error, results) => {
        if (error) {
            response.status(500).send(error.message)
            return
        } 
        response.status(200).json(results.rows)
    })
}


/**
 * Customer Promos
 */

const checkPromoEligibility = (request, response) => {
    const code = request.params.code
    const total = parseInt(request.params.total)

    pool.query('SELECT amount FROM Promos WHERE code = $1 AND $2 > minSpend', 
        [code, total], (error, results) => {
        if (error) {
            response.status(500).send(error.message)
            return
        }
        if (results == undefined) {
            response.status(500).send("Promo invalid")
            return
        } else {
            response.status(200).json(results.rows)
        }
    })
}

const addCustomerPromo = (request, response) => {
    const { code, amount, minSpend, startDate, endDate, cid } = request.body

    pool.query('INSERT INTO Promos (cid, code, amount, minSpend, startDate, endDate) VALUES ($1, $2, $3, $4, $5, $6)',
    [cid, code, amount, minSpend, startDate, endDate],
    (error, results) => {
        if (error) {
            response.status(500).send(error.message)
            return
        } 
        response.status(200).send(`success`)
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

const getCurrentRestPromos = (request, response) => {
    const restaurantId = parseInt(request.params.uid)
    var query = (SQL
        `SELECT code, amount, minspend, date_trunc('day', startdate)::date as startdate, date_trunc('day',enddate)::date as enddate
        FROM promos 
        WHERE restaurantid = $1
        AND date_trunc('day',CURRENT_TIMESTAMP)::date <= endDate
        AND date_trunc('day',CURRENT_TIMESTAMP)::date >= startDate;`
        )

    pool.query(query,[restaurantId], (error, results) => {
        if (error) {
            response.status(500).send(error.message)
            return
        } 
        response.status(200).json(results.rows)
    })
}

const addRestaurantPromo = (request, response) => {
    const { restaurantid, code, amount, minSpend, startDate, endDate } = request.body

    pool.query('INSERT INTO Promos (restaurantId, code, amount, minSpend, startDate, endDate) VALUES ($1, $2, $3, $4, $5, $6)',
    [restaurantid, code, amount, minSpend, startDate, endDate],
    (error, results) => {
        if (error) {
            response.status(500).send(error.message)
            return
        } 
        response.status(200).send(`success`)
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
 * Order Items
 */

const getOrderItemInfo = (request, response) => {
    const restaurantname = request.params.restaurantname
    const fooditemname = request.params.foodname
    pool.query('SELECT foodId FROM Menu M, Restaurants R WHERE R.restaurantname = $1 AND R.restaurantId = M.restaurantId AND M.foodname = $2', 
        [restaurantname, fooditemname], (error, results) => {
        if (error) {
            response.status(500).send("An error has occured.")
            return
        }
        response.status(200).json(results.rows)
    })
}

const addOrderItems = (request, response) => {
    const orderId = parseInt(request.params.orderId)
    let foodId = parseInt(request.body.foodid)
    let quantity = parseInt(request.body.quantity)

    pool.query('INSERT INTO OrderItems (orderId, foodId, quantity) VALUES ($1, $2, $3)',
        [orderId, foodId, quantity], (error, results) => {
        if (error) {
            response.status(500).send("An error has occured.")
            return
        }
        response.status(200).send(`success`)
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

const updateRiderArrives = (request, response) => {
    const orderId = parseInt(request.params.orderId)

    pool.query('UPDATE OrderTimes SET timeriderarrives = CURRENT_TIMESTAMP WHERE orderid = $1', [orderId], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send("success")
    })
}

const updateRiderCollects = (request, response) => {
    const orderId = parseInt(request.params.orderId)

    pool.query('UPDATE OrderTimes SET timeriderdeparted = CURRENT_TIMESTAMP WHERE orderid = $1', [orderId], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send("success")
    })
}

const updateRiderDelivers = (request, response) => {
    const orderId = parseInt(request.params.orderId)

    pool.query('UPDATE OrderTimes SET timeriderdelivered = CURRENT_TIMESTAMP WHERE orderid = $1', [orderId], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send("success")
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

const getMonthlySummaryStatistic = (request, response) => {
    var query = (SQL
        `WITH newCustomersPerMonth AS (
            select date_part('month', createdAt) as month, count(uid) as newCust
            from Users
            where type = 'customer'
            group by month
            order by month DESC
        )
        select coalesce(CO.month, NC.month) as month, coalesce(count(distinct CO.orderId), 0) as totalOrders, coalesce(SUM(CO.price * CO.quantity), '$0') as totalCost, coalesce(NC.newCust,0) as newCustCount
        from completedOrders CO full outer join newCustomersPerMonth NC using(month)
        group by CO.month, NC.month, newCustCount
        order by month DESC;`
        )
    pool.query(query, (error, results) => {    
    if (error) {
        console.log(error)
        response.status(500).send(error.message)
        return
    } 
    response.status(200).json(results.rows)
    })
}

const getCustomerStatistics = (request, response) => {
    const month = parseInt(request.params.month)

    var query = (SQL
        `  
        select CO.cname, COUNT(distinct CO.orderId) as totalOrders, SUM(CO.price * CO.quantity) as totalCost
        from completedOrders CO
        where CO.month = $1
        group by cid,cname
        order by cid;`
        )

    pool.query(query, [month], (error, results) => {
        if (error) {
            response.status(500).send("An error has occured.")
            return
        }
        response.status(200).json(results.rows)
    })
}

const getOrdersPerLocation = (request, response) => {
    pool.query('select * from areasummary', (error, results) => {
        if (error) {
            response.status(500).send("An error has occured.")
            return
        }
        response.status(200).json(results.rows)
    })
}

const getRiderSummary = (request, response) => {
    pool.query('SELECT * FROM riderstatistics', (error, results) => {
        if (error) {
            response.status(500).send("An error has occured.")
            return
        }
        response.status(200).json(results.rows)
    })
}

const getRestaurantOrderStatistic = (request, response) => {
    const restId = parseInt(request.params.uid)
    var query = (SQL
                `select month, COUNT(distinct orderid) as totalorders, SUM(cost) as totalcost
                from discountedorders
                where restaurantid = $1
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

const getRestaurantOrderTopFive = (request, response) => {
    const month = parseInt(request.params.month)
    const restId = parseInt(request.params.uid)
    
    var query = (SQL
                `select foodname, sum(quantity) as count
                from completedOrders
                where restaurantId = $1
                and date_part('month', timeRiderDelivered) = $2
                group by foodname
                order by sum(quantity) DESC
                limit 5;`
                )

    pool.query(query,[restId, month], (error, results) => {    
        if (error) {
            console.log(error)
            response.status(500).send(error.message)
            return
        } 
        response.status(200).json(results.rows)
    })
}

const getRestaurantPromoSummary = (request, response) => {
    const restId = parseInt(request.params.uid)
    
    var query = (SQL
                `WITH promoSummary AS (
                    select P.code, COUNT(distinct C.OrderId) as totalOrders
                    from completedOrders C 
                    inner join Promos P on (C.promoCode = P.code)
                    where C.restaurantId = $1
                    group by P.code
                    order by P.endDate
                ), endedPromos AS (
                    select code, endDate - startDate as duration
                    from promos 
                    where restaurantid = $1
                    and enddate < date_trunc('day', CURRENT_TIMESTAMP)::date   
                )
               
                SELECT code, duration, COALESCE(ROUND(CAST(totalorders AS NUMERIC(10,3))/CAST(duration AS NUMERIC(10,3))), 0) AS averageOrders, COALESCE(totalorders, 0) as totalorders
                FROM promoSummary 
                RIGHT JOIN endedPromos using (code);`
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
    getAddress,
    updateAddress,

    createCustomer,
    getCustomerInfo,
    getCustomerAddress,
    getCustomerOrders,
    updateCreditCard,
    updateCustomerReward,
    customerAddAddress,
    getPastOrders,
    getPastItems,

    getRestaurants,
    createRestaurant,
    getRestaurantInfo,
    updateRestaurantMinOrder,
    updateRestaurantDeliveryFee,
    findRestaurant,

    createRider,
    getRiderInfo,
    getRiderCurrentOrders,
    getRiderPastOrders,
    getFulltimeRiderHours,
    getParttimeRiderHours,
    setFulltimeRiderDay,
    setFulltimeRiderShift,
    addParttimeSlot,
    deleteParttimeSlot,

    getMenu,
    getMenuForRestaurant,
    checkItemAvail,
    getItemInfo,
    getMenuInfo,
    addMenuItem,
    updateMenuItem,
    updateMenuItemQuant,
    deleteMenuItem,

    getReviews,
    addReview,

    getOrders,
    getOrder,
    createNewOrder,

    checkPromoEligibility,
    addCustomerPromo,
    updateCustomerPromo,

    checkRestaurantPromoEligibility,
    getCurrentRestPromos,
    addRestaurantPromo,
    updateRestaurantPromo,

    getOrderItemInfo,
    addOrderItems,

    getOrderTimes,
    updateRiderArrives,
    updateRiderCollects,
    updateRiderDelivers,

    getWWSRiderHours,
    addWWSRiderHours,
    getMWSRiderHours,
    addMWSRiderHours,

    getMonthlySummaryStatistic,
    getCustomerStatistics,
    getOrdersPerLocation,
    getRiderSummary,

    getRestaurantOrderStatistic,
    getRestaurantOrderTopFive,
    getRestaurantPromoSummary
}
