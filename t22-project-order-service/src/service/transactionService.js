const dotenv = require('dotenv')
const conn = require('../connection/db-connection.js')
const axios = require('axios')
dotenv.config()

class TransactionService {

  async createTransaction(orderId, transactionId) {



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

  async triggerWalletTransaction(transactionObject) {
    let walletServiceURL = process.env.walletSvc || 'http://localhost:9090'
    walletServiceURL = walletServiceURL + '/wallet/deductAmount/'

    return new Promise(function (resolve, reject) {
      try {
        axios.post(walletServiceURL, transactionObject, {
          headers: {
            Accept: 'application/json'
          }
        })
          .then(response => {
            console.log(response.data);
            resolve(response.data)
          })
          .catch(error => {
            console.log(error);

            if (error.response) {
              console.log(error.response.data);
              console.log(error.response.status);

              reject(error.response.data)
            } else {
              reject(error)
            }
          });
      }
      catch (e) {
        console.error(e)
        throw Error(e)
      }
    })
  }


}

module.exports = TransactionService
