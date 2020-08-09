const joi = require('joi')
const Service = require('../service/orderService.js')

class Controller {

    async add(request, response) {
        try {
            let orderService = new Service()
            let responseObj = await orderService.add(request.body)
            console.log(`responseObj from service:`, responseObj)
            response.json(responseObj);
        } catch (e) {
            console.error(e)
            response.json({
              status: 500,
              error: "Error while creating the order"
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
}
module.exports = Controller
