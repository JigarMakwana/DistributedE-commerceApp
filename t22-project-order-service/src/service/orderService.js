const axios = require('axios')
const dotenv = require('dotenv')
const moment = require('moment')
const conn = require('../connection/db-connection.js')
dotenv.config()

class Service {
  async add(request) {
    let newOrder = {
      date: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      userID: request.userID,
      amount: request.amount
    }

    return new Promise(function (resolve, reject) {
      try {
        let insertQuery = 'INSERT INTO Orders SET ?';

        conn.query(insertQuery, newOrder, async function (err, rows) {
          if (err) {
            console.error('row: ' + rows)
            console.error(err)
            let err_response = {
              error: `Error while creating order`,
              messsage: err.sqlMessage
            };
            reject(err_response)
          } else {
            for (var i = 0; i < request['items'].length; i++) {
              let insertOrderItemQuery = 'INSERT INTO Order_Item SET ?';
              let newOrderItem = {
                orderID: rows.insertId,
                itemID: request['items'][i].itemID,
                qty: request['items'][i].qty
              }

              conn.query(insertOrderItemQuery, newOrderItem, async function (err, rows) {
                if (err) {
                  console.error('row: ' + rows)
                  console.error(err)
                  let err_response = {
                    error: `Error while creating Order_Item`,
                    messsage: err.sqlMessage
                  };
                  reject(err_response)
                } else {
                  let response = {
                    messsage: `Successfully created the order`
                  };
                  resolve(response)
                }
              })
            }
          }
        })
      }
      catch (e) {
        console.error(e)
        throw Error(e)
      }
    })
  }

  async delete(orderID) {
    return new Promise(function (resolve, reject) {
      try {
        let deleteOrderItemQuery = 'DELETE FROM Order_Item WHERE orderID=?';
        conn.query(deleteOrderItemQuery, [orderID], async function (err, rows) {
          if (err) {
            console.error('row: ' + rows)
            console.error(err)
            let err_response = {
              error: `Error while deleting order`,
              messsage: err.sqlMessage
            };
            reject(err_response)
          } else {
            let deleteQuery = 'DELETE FROM Orders WHERE orderID=?';
            conn.query(deleteQuery, [orderID], async function (err, rows) {
              if (err) {
                console.error('row: ' + rows)
                console.error(err)
                let err_response = {
                  error: `Error while deleting Order_Item`,
                  messsage: err.sqlMessage
                };
                reject(err_response)
              } else {
                let response = {
                  messsage: `Successfully deleted the order`
                };
                resolve(response)
              }
            })
          }
        })
      }
      catch (e) {
        console.error(e)
        throw Error(e)
      }
    })
  }
  async getOrders(user_id) {
    return new Promise(function (resolve, reject) {
      try {
        console.log(`Requesting retrieval of the order with userID : ${user_id}`)

        // MySQL DB query for fetching the jobrecord
        let get_Orders_query = 'SELECT t.insertId,f.itemID,f.qty,t.userID,t.amount FROM local_program.Orders as t,local_program.Order_Item as f where f.orderID = t.insertId and t.userID = ?';

        // MySQL query execution
        let orderList = conn.query(get_Orders_query, user_id, async function (err, rows) {
          if (err) {
            console.error('row: ' + rows)
            console.error(err)
            let err_response = {
              error: `No record exist`,
              messsage: err.sqlMessage
            };

            reject(err_response)
          } else {
            let orderList = [];
            let orderListObject = []
            let eachOrder = {}
            let eachItems = []
            let count = 0
            for (var i in rows) {
              console.log(rows[i])
              if (orderList.includes(rows[i].insertId)) {
                eachItems.push({ "itemID": rows[i].itemID, "qty": rows[i].qty })
                eachOrder['items'] = eachItems
              }
              else {
                console.log('b')
                if (count > 0) {
                  orderListObject.push(eachOrder)
                }
                eachOrder = {}
                eachItems = []
                orderList.push(rows[i].insertId)
                eachOrder['OrderID'] = rows[i].insertId
                eachOrder['amount'] = rows[i].amount
                eachItems.push({ "itemID": rows[i].itemID, "qty": rows[i].qty })
                eachOrder['items'] = eachItems
                count++;
              }
            }
            orderListObject.push(eachOrder)
            console.log(`responseObj in service class`, orderListObject)
            resolve(orderListObject)
          }
        })
      }
      catch (e) {
        console.error(`Error in retrieval of the order with userID : ${user_id}`)
        console.error(e)
        throw Error(e)
      }
    })
  }

}

module.exports = Service
