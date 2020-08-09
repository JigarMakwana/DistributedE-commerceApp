const dotenv = require('dotenv')
const conn = require('../connection/db-connection.js')
dotenv.config()

class TransactionService {

  async createTransaction(orderId) {

    let transactionId = Math.random().toString(36).slice(2)

    let newTransaction = {
      orderId: orderId,
      transactionId: transactionId,

    }

    return new Promise(function (resolve, reject) {
      try {
        let insertQuery = 'INSERT INTO order_transaction SET ?';

        conn.query(insertQuery, newTransaction, async function (err, rows) {
          if (err) {
            console.error('row: ' + rows)
            console.error(err)
            let err_response = {
              error: `Error while creating transaction`,
              messsage: err.sqlMessage
            };
            reject(err_response)
          } else {
            console.log(`Transaction : ${transactionId} is created successfully.`)
            resolve(newTransaction)
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

module.exports = TransactionService
