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
                        for (var i=0; i<request['items'].length; i++) {
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
}

module.exports = Service
