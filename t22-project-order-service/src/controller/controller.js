const joi = require('joi')
const Service = require('../service/orderService.js')
const TransactionService = require('../service/transactionService.js')

class Controller {

  async add(request, response) {
    try {

      let orderService = new Service()
      let orderServiceResponse = await orderService.add(request.body)


      if (orderServiceResponse != undefined) {
        console.log(`orderServiceResponse:`, orderServiceResponse)
        let transactionService = new TransactionService();
        let transactionResponse = await transactionService.createTransaction(orderServiceResponse.data.orderID);

        console.log(`transactionResponse:`, transactionResponse)
        response.json(orderServiceResponse);
      } else {
        response.status(409).send({ error: "error in creating the order. Please try again" })
      }


    } catch (e) {
      console.error(e)
      response.json({
        status: 500,
        error: "Error while creating the order",
        message: e
      });
    }
  }

  async delete(request, response) {
    try {
      let orderService = new Service()
      let responseObj = await orderService.delete(request.params.id)
      console.log(`responseObj from service:`, responseObj)
      response.json(responseObj);
    } catch (e) {
      console.error(e)
      response.json({
        status: 500,
        error: "Error while deleting the order"
      });
    }
  }
  async getOrders(request, response) {

    try {
      let orderService = new Service()
      let responseObj = await orderService.getOrders(request.query.user_id)
      console.log(`responseObj from service:`, responseObj)

      if (request.header('Accept').includes('application/json')) {
        response.send(responseObj);
      }
      else {
        response.render('successList', { orders: responseObj });
      }

    } catch (e) {
      console.error(e)
      response.json({
        status: 500,
        error: "Error while getting Order"
      });
    }
  }
}
module.exports = Controller
