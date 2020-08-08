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

    async editPart(id, quantity) {
        return new Promise(function (resolve, reject) {
            try {
                let updateQuery = 'UPDATE Parts SET qoh=? WHERE partId=?';
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

    async deletePart(id) {
        return new Promise(function (resolve, reject) {
            try {
                let updateQuery = 'DELETE FROM Parts WHERE partId=?';
                mysqlConnection.query(updateQuery, [id], async function (err, rows) {
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

    async getPartsByID(id) {
        return new Promise(function (resolve, reject) {
            try {
                if (id != undefined) {
                    var selectQuery = 'SELECT * FROM Parts WHERE partId=' + id;
                }
                else {
                    var selectQuery = 'SELECT * FROM Parts';
                }

                let partRecords = mysqlConnection.query(selectQuery, async function (err, rows) {
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

    // Service method for getting multiple parts from the partIdList
    async getPartsForJobs(partIdList) {
        return new Promise(function (resolve, reject) {
            try {
                var selectQuery = 'SELECT * FROM Parts WHERE partId IN (' + partIdList + ')';

                let partRecords = mysqlConnection.query(selectQuery, async function (err, rows) {
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

    async createPartOrder(partOrder) {

        return new Promise(function (resolve, reject) {

            try {
                let newPartOrder = {
                    partId: partOrder.partId,
                    jobName: partOrder.jobName,
                    userId: partOrder.userId,
                    qty: partOrder.qty
                }

                console.log(`Requesting creation of the PartOrder: ${newPartOrder.partId}`)

                // MySQL DB query
                let insertQuery = 'INSERT INTO PartOrdersY SET ?';

                // MySQL query execution
                mysqlConnection.query(insertQuery, newPartOrder, async function (err, rows) {
                    if (err) {
                        console.error('row: ' + rows)
                        console.error(err)
                        let err_response = {
                            error: `PartId : ${newPartOrder.partId}, JobName: ${newPartOrder.jobName}, userId: ${newPartOrder.userId} already exists. Please try with new Part Id, jobName, and UserId.`,
                            messsage: err.sqlMessage
                        };

                        reject(err_response)
                    } else {
                        console.log(`PartOrder with PartId : ${newPartOrder.partId}, JobName: ${newPartOrder.jobName}, userId: ${newPartOrder.userId} is created successfully.`)

                        let responseObj = {
                            info: `PartOrder with PartId : ${newPartOrder.partId}, JobName: ${newPartOrder.jobName}, userId: ${newPartOrder.userId}  is created successfully.`,
                            data: newPartOrder
                        };

                        console.log(`responseObj in create service class`, responseObj)
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

    async getSuccesfulJobPartOrderList() {

        return new Promise(function (resolve, reject) {
            try {
                // MySQL DB query
                let getQuery = 'select * from PartOrdersY order by jobName, userId, partId';

                // MySQL query execution
                let jobsList=  mysqlConnection.query(getQuery, async function (err, rows) {
                    if (err) {
                        console.error('row: ' + rows)
                        console.error(err)
                        let err_response = {
                            error: `No record exist`,
                            messsage: err.sqlMessage
                        };

                        reject(err_response)
                    } else {
                        console.log(rows);
                        console.log(`responseObj in service class`, rows)
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
