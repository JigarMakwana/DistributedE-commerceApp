const axios = require('axios')
const dotenv = require('dotenv')
const moment = require('moment')
const mysqlConnection = require('../connection/db-connection.js')
dotenv.config()

// Service class
class Service {

    constructor() {
    }

    async getAllItems() {
        let getInventoryUrl = "https://2o3pti1up3.execute-api.us-east-1.amazonaws.com/production/api/items"

            // getInventoryUrl = getInventoryUrl + '/'

        return new Promise(function (resolve, reject) {
            try {
                axios.get(getInventoryUrl, {
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
                        let err_response = {
                            error: error
                        };
                        reject(err_response)
                    });
            }
            catch (e) {
                console.error(e)
                throw Error(e)
            }
        })
    }

    async getWalletBalance() {
        let getwalletUrl =  "http://localhost:8080/wallet?userId=2";

            // getInventoryUrl = getInventoryUrl + '/'

        return new Promise(function (resolve, reject) {
            try {
                axios.get(getwalletUrl, {
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
                        let err_response = {
                            error: error
                        };
                        reject(err_response)
                    });
            }
            catch (e) {
                console.error(e)
                throw Error(e)
            }
        })
    }

     // Get all items API call
    // Service method for getting all items from the Inventory
    // async getAllItems() {
    //     return new Promise(function (resolve, reject) {
    //         try {
    //             var selectQuery = 'SELECT * FROM item';

    //             let partRecords = mysqlConnection.query(selectQuery, async function (err, rows) {
    //                 if (err) {
    //                     console.error('row: ' + rows);
    //                     console.error(err);
    //                     let err_response = {
    //                         error: `No record exist`,
    //                         messsage: err.sqlMessage
    //                     };
    //                     reject(err_response)
    //                 } else {
    //                     console.log(`responseObj in edit service`, rows)
    //                     resolve(rows)
    //                 }
    //             })
    //         }
    //         catch (e) {
    //             console.error(e)
    //             throw Error(e)
    //         }
    //     })
    // }

    async saveJobSearchRecord(jobName) {

        return new Promise(function (resolve, reject) {
            try {
                var currentTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                let jobSearchHistory = {
                    jobName: jobName,
                    searchedAt: currentTimestamp
                }

                // MySQL DB query
                let insertQuery = 'INSERT INTO job_search_history SET ?';

                // MySQL query execution
                mysqlConnection.query(insertQuery, jobSearchHistory, async function (err, rows) {
                    if (err) {
                        console.error('row: ' + rows)
                        console.error(err)
                        let err_response = {
                            error: `Error in adding job search history`,
                            messsage: err.sqlMessage
                        };
                        reject(err_response)
                    } else {

                        let response = {
                            messsage: `Job: ${jobName} search history saved at ${jobSearchHistory.searchedAt} `
                        };

                        resolve(response)
                    }
                })
            }
            catch (e) {
                console.error(e)
                throw Error(e)
            }
        })
    }

    // Get all jobs API call
    async getJobsList() {
        let getJobUrl = process.env.jobSvcUrl || 'http://localhost:9090'
        getJobUrl = getJobUrl + '/api/jobs/'
        return new Promise(function (resolve, reject) {
            try {
                axios.get(getJobUrl, {
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
                        let err_response = {
                            error: error
                        };
                        reject(err_response)
                    });
            }
            catch (e) {
                console.error(e)
                throw Error(e)
            }
        })
    }

    // Get all jobs API call
    async searchJob(jobName) {
        let getJobUrl = process.env.jobSvcUrl || 'http://localhost:9090'
        getJobUrl = getJobUrl + '/api/jobs/getJob?jobName=' + jobName
        return new Promise(function (resolve, reject) {
            try {
                axios.get(getJobUrl, {
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

                            let err_response = {
                                error: error.response.data
                            };
                            reject(err_response)
                        } else {
                            let err_response = {
                                error: error
                            };
                            reject(err_response)
                        }
                    });
            }
            catch (e) {
                console.error(e)
                throw Error(e)
            }
        })
    }

    // Get all jobs API call
    async getPartDetailsForJob(parts) {
        let getJobUrl = process.env.partSvcUrl || 'http://localhost:9091'
        getJobUrl = getJobUrl + '/api/parts/getPartList'
        return new Promise(function (resolve, reject) {
            try {
                axios.post(getJobUrl, parts, {
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

                            let err_response = {
                                error: error.response.data
                            };
                            reject(err_response)
                        } else {
                            let err_response = {
                                error: error
                            };
                            reject(err_response)
                        }
                    });
            }
            catch (e) {
                console.error(e)
                throw Error(e)
            }
        })
    }

    async updatePartDetails(partId, qty) {
        console.log("upaddada");
        console.log(partId);
        let updatePartUrl = process.env.partSvcUrl || 'http://localhost:9091'
        updatePartUrl = updatePartUrl + '/parts/edit'
        return new Promise(function (resolve, reject) {
            try {
                axios.post(updatePartUrl, { "partId": partId, "quantity": qty }, {
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

                            let err_response = {
                                error: error.response.data
                            };
                            reject(err_response)
                        } else {
                            let err_response = {
                                error: error
                            };
                            reject(err_response)
                        }
                    });
            }
            catch (e) {
                console.error(e)
                throw Error(e)
            }
        })
    }

    async createJobParts(job, userId, result) {
        return new Promise(function (resolve, reject) {

            try {
                var currentTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                let newJobPart = {
                    partId: job['partId'],
                    jobName: job['jobName'],
                    userId: userId,
                    qty: job['qty'],
                    createdDatetime: currentTimestamp,
                    result: result
                }

                // MySQL DB query
                let insertQuery = 'INSERT INTO JobParts SET ?';

                // MySQL query execution
                mysqlConnection.query(insertQuery, newJobPart, async function (err, rows) {
                    if (err) {
                        console.error('row: ' + rows)
                        console.error(err)
                        let err_response = {
                            error: `PartID : ${newJobPart.partId}, JobName : ${newJobPart.jobName} , UserId : ${newJobPart.userId}  already exists. Please try with new Part ID, JobName, and UserId.`,
                            messsage: err.sqlMessage
                        };

                        reject(err_response)
                    } else {
                        console.log(`JobParts with PartID : ${newJobPart.partId}, JobName : ${newJobPart.jobName} , UserId : ${newJobPart.userId} is created successfully.`)

                        let responseObj = {
                            info: `JobParts with PartID : ${newJobPart.partId}, JobName : ${newJobPart.jobName} , UserId : ${newJobPart.userId} is created successfully.`,
                            data: newJobPart
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

    async createPartOrderX(job, userId) {
        let createPartOrderXUrl = process.env.jobSvcUrl || 'http://localhost:9090'
        createPartOrderXUrl = createPartOrderXUrl + '/api/addPartOrders'
        return new Promise(function (resolve, reject) {
            try {
                axios.post(createPartOrderXUrl, { "partId": job["partId"], "jobName": job["jobName"], "userId": userId, "qty": job["qty"] }, {
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

                            let err_response = {
                                error: error.response.data
                            };
                            reject(err_response)
                        } else {
                            let err_response = {
                                error: error
                            };
                            reject(err_response)
                        }
                    });
            }
            catch (e) {
                console.error(e)
                throw Error(e)
            }
        })
    }

    async createPartOrderY(job, userId) {
        let createPartOrderYUrl = process.env.partSvcUrl || 'http://localhost:9091'
        createPartOrderYUrl = createPartOrderYUrl + '/api/addPartOrders'
        return new Promise(function (resolve, reject) {
            try {
                axios.post(createPartOrderYUrl, { "partId": job["partId"], "jobName": job["jobName"], "userId": userId, "qty": job["qty"] }, {
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

                            let err_response = {
                                error: error.response.data
                            };
                            reject(err_response)
                        } else {
                            let err_response = {
                                error: error
                            };
                            reject(err_response)
                        }
                    });
            }
            catch (e) {
                console.error(e)
                throw Error(e)
            }
        })
    }

    async getJobPartsByUserId(id) {
        return new Promise(function (resolve, reject) {
            try {

                var selectQuery = 'SELECT jobName, partId, qty FROM JobParts WHERE userId=' + id;


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
                        console.log(`responseObj in getJobPartsByUserId service`, rows)
                        resolve(JSON.parse(JSON.stringify(rows)));
                    }
                })
            }
            catch (e) {
                console.error(e)
                throw Error(e)
            }
        })
    }

    //Job search history retrieval
    async getJobSearchHistoryList() {
        return new Promise(function (resolve, reject) {
            try {

                var selectQuery = 'SELECT * FROM job_search_history';
                mysqlConnection.query(selectQuery, async function (err, rows) {
                    if (err) {
                        console.error('row: ' + rows);
                        console.error(err);
                        let err_response = {
                            error: `No record exist`,
                            messsage: err.sqlMessage
                        };
                        reject(err_response)
                    } else {
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

    //Job search history retrieval
    async getJobOrdersList() {
        return new Promise(function (resolve, reject) {
            try {

                var selectQuery = 'SELECT * FROM JobParts';
                mysqlConnection.query(selectQuery, async function (err, rows) {
                    if (err) {
                        console.error('row: ' + rows);
                        console.error(err);
                        let err_response = {
                            error: `No record exist`,
                            messsage: err.sqlMessage
                        };
                        reject(err_response)
                    } else {
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
module.exports = Service
