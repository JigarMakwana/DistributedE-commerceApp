
const Service = require('../service/orderService.js')
const TransactionService = require('../service/transactionService.js')


class Controller {

  async add(request, response) {
    try {

      let transactionId = Math.random().toString(36).slice(2)

      // Step -1
      // Trigger wallet transaction API
      let walletTransactionRequest = {
        userId: request.body.userID,
        amount: request.body.amount,
        globalTransactionId: transactionId
      }

      let transactionService = new TransactionService();

      let walletTransactionResponse = await transactionService.triggerWalletTransaction(walletTransactionRequest);
      console.log(`walletTransactionResponse:`, walletTransactionResponse)

      //Step-2
      // Trigger inventory transaction API
      // TODO


      //Step-3
      // call create order service call
      if (walletTransactionResponse != undefined) {
        let orderService = new Service()
        let orderServiceResponse = await orderService.add(request.body)

        if (orderServiceResponse != undefined) {
          console.log(`orderServiceResponse:`, orderServiceResponse)
          let transactionResponse = await transactionService.createTransaction(orderServiceResponse.data.orderID, transactionId);

          console.log(`transactionResponse:`, transactionResponse)

          if (transactionResponse != null) {
            console.log(`transactionResponse:`, transactionResponse)
            response.json(orderServiceResponse);
          }
        }
        else {
          response.status(409).send({ error: "error in creating the order. Please try again" })
        }

      }
      else {
        response.status(409).send({ error: "Error in creating the order. Please approve/reject the previous order." })
      }

    } catch (e) {
      console.error(e)


      if (e.error.error === "Error in starting the transaction") {
        response.status(409).send({ error: "Error in creating the order. Please approve or reject the previous order." })
      } else {
        response.status(500).send(e)
      }


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
