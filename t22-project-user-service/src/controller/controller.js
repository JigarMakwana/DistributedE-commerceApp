const joi = require('joi')
const Service = require('../service/service.js')
const UserService = require('../service/userService.js')
const UserController = require('../controller/userController.js')
const Cookies = require('js-cookie')
// Schema
const getJobSchema = joi.object().keys({

    // jobName is required
    jobName: joi.string().required(),

});

// Controller class for handling job related operation
class Controller {

    constructor() {
    }

    // Get all item
    async getItemsList(request, response) {
        try {
            let itemService = new Service()
            let responseObj = await itemService.getAllItems()
            //   const uniqueJob = [...new Map(responseObj.map(item => [item['jobName'], item])).values()]
            //   console.log(`unique job:`, uniqueJob)
            response.render('placeOrder', { items: responseObj });
        } catch (e) {
            console.error(e)
            response.render('error', { error: e.error });
        }
    }

    async getAllItemsList(request, response) {
        try {
            let itemService = new Service()
            let responseObj = await itemService.getAllItems()

            //   const uniqueJob = [...new Map(responseObj.map(item => [item['jobName'], item])).values()]
            //   console.log(`unique job:`, uniqueJob)

            response.render('list', { items: responseObj });

        } catch (e) {
            console.error(e)
            response.render('error', { error: e.error });
        }
    }

    // Get user wallet balance
    async getWalletBalance(request, response) {
        try {
            console.log('In myWallet route Cookies: ', request.cookies.userId)
            let userId = request.cookies.userId;
            let itemService = new Service()
            let responseObj = await itemService.getWalletBalance(userId)
            response.render('myWallet', { amount: responseObj });

        } catch (e) {
            console.error(e)
            response.render('error', { error: e.error });
        }
    }

    // Post order details
    async buy(request, response) {
        try {
            console.log('In myWallet route Cookies: ', request.cookies.email)
            let userId = request.cookies.userId;
            let service = new Service();
            var itemId = request.body.item;
            var quantity = request.body.quantity;
            let res = await service.getItemDetailsByID(itemId);
            let data = {
                userID: userId,
                amount: res[0].price * quantity,
                items: [{ itemID: itemId, qty: quantity, name: res[0].itemName }]
            }
            console.log(data);
            let itemService = new Service()
            let responseObj = await itemService.buy(data)
            console.log(`responseObj from service:`, responseObj)
            response.render('placeOrderSuccess', { success: request.cookies.email });
        } catch (e) {
            response.render('error', { error: e.error });
            // console.error("this is in controller: " + e)
            // if(e === 500)
            // response.render('placeOrderFundError', { msg: request.cookies.email });
            // else
            //     response.render('placeOrderError', { msg: request.cookies.email });
        }
    }

    // Get order history
    async getOrderHistory(request, response) {
        try {
            console.log('In myWallet route Cookies: ', request.cookies.userId)
            let userId = request.cookies.userId;
            let orderService = new Service()
            let responseObj = await orderService.getOrderHistory(userId)
            console.log(`responseObj from service:`, responseObj)
            response.render('orderHistory', { jobs: responseObj });

        } catch (e) {
            console.error(e)
            response.render('error', { error: e.error });
        }
    }
}
module.exports = Controller
