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
        // let getInventoryUrl = "http://itemservice-env.eba-2h8vgeyy.us-east-1.elasticbeanstalk.com/api/items"
        let getInventoryUrl = process.env.inventorySvcUrl
        getInventoryUrl = getInventoryUrl + '/api/items/'

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

    async getItemDetailsByID(itemId) {
        let getInventoryUrl = process.env.inventorySvcUrl
        getInventoryUrl = getInventoryUrl + `/api/items/getItem?itemId=${itemId}`

        return new Promise(function (resolve, reject) {
            try {
                axios.get(getInventoryUrl, {
                    headers: {
                        Accept: 'application/json'
                    }
                })
                    .then(response => {
                        console.log("service"+JSON.stringify(response.data));
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

    async getWalletBalance(userId) {
        // let getwalletUrl =  `http://wallet-svc.us-east-1.elasticbeanstalk.com/wallet?userId=${userId}`;
        let walletSvcUrl = process.env.walletSvcUrl
        walletSvcUrl = walletSvcUrl + `?userId=${userId}`
        return new Promise(function (resolve, reject) {
            try {
                axios.get(walletSvcUrl, {
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

    async buy(data)     {
        // let orderURL =  `https://cloud-order-svc-bcyssspw3a-ue.a.run.app/add`;
        let orderSvcUrl = process.env.orderSvcUrl
        orderSvcUrl = orderSvcUrl + `/add`
        return new Promise(function (resolve, reject) {
            try {
                axios.post(orderSvcUrl, data, {
                    headers: {
                        Accept: 'application/json'
                    }
                })
                    .then(response => {
                        console.log(response.data);
                        resolve(response.data)
                    })
                    .catch(error => {
                        console.log("This is in buy: " + error.response.status);
                        let err_response = {
                            error: error
                        };
                        reject(error.response.status)
                    });
            }
            catch (e) {
                console.error(e)
                throw Error(e)
            }
        })
    }

    async getOrderHistory(userId) {
        // let orderURL =  `https://cloud-order-svc-bcyssspw3a-ue.a.run.app/getOrders?user_id=${userId}`;
        let orderSvcUrl = process.env.orderSvcUrl
        orderSvcUrl = orderSvcUrl + `/getOrders?user_id=${userId}`
        return new Promise(function (resolve, reject) {
            try {
                axios.get(orderSvcUrl, {
                    headers: {
                        Accept: 'application/json'
                    }
                })
                    .then(response => {
                        console.log("In getOrderHistory: " + response.data);
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
}
module.exports = Service
