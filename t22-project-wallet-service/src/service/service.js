const mysqlConnection  = require('../connection/db-connection.js')

// Service class for handling user operation
class Service {

    constructor() {
    }

    async createUserWallet(userWallet) {

        return new Promise(function (resolve, reject) {

            try {
                let newWalletData = {
                    userId: userWallet.userId,
                    amount: userWallet.amount || 0.00
                }

                console.log(`Requesting wallet creation for the user: ${newWalletData.userId}`)

                // MySQL DB query
                let insertQuery = 'INSERT INTO wallet SET ?';

                // MySQL query execution
                mysqlConnection.query(insertQuery, newWalletData, async function (err, rows) {
                    if (err) {
                        console.error('row: ' + rows)
                        console.error(err)
                        let err_response = {
                            error: `Wallet data for the user : ${newWalletData.userId} already exists.`,
                            messsage: err.sqlMessage
                        };

                        reject(err_response)
                    } else {
                        console.log(`User : ${newWalletData.userId}  wallet is created successfully.`)

                        let responseObj = {
                            info: `User: ${newWalletData.userId}  wallet is created successfully.`,
                            data: newWalletData
                        };

                        console.log(`responseObj in create wallet service class`, responseObj)
                        resolve(responseObj)
                    }
                })
            }
            catch (e) {
                console.error(e)
                throw Error(e)
            }
        })
    }

    async updateWallet(id, quantity) {
        return new Promise(function (resolve, reject) {
            try {
                let updateQuery = 'UPDATE wallet SET amount=? WHERE userId=?';
                mysqlConnection.query(updateQuery, [quantity, id], async function (err, rows) {
                    if (err) {
                        console.error('row: ' + rows);
                        console.error(err);
                        let err_response = {
                            error: `No record exist`,
                            messsage: err.sqlMessage
                        };
                        reject(err_response)
                    } else {
                        console.log(`responseObj in edit service`, rows)
                        resolve(rows)
                    }
                })
            }
            catch (e) {
                console.error(e)
                throw Error(e)
            }
        })
    }

    async getWallet(userId) {
        return new Promise(function (resolve, reject) {
            try {
                if (userId != undefined) {
                    var selectQuery = 'SELECT * FROM wallet WHERE userId=' + userId;
                }
                else {
                    var selectQuery = 'SELECT * FROM wallet';
                }

                let walletRecords = mysqlConnection.query(selectQuery, async function (err, rows) {
                    if (err) {
                        console.error('row: ' + rows);
                        console.error(err);
                        let err_response = {
                            error: `No record exist`,
                            messsage: err.sqlMessage
                        };
                        reject(err_response)
                    } else {
                        console.log(`responseObj in edit service`, rows)
                        resolve(rows)
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
module.exports =  Service
