const joi = require('joi')
const Service = require('../service/service.js')
const dotenv = require('dotenv')

dotenv.config()

const awsLambdaPath = process.env.awsLambdaPath || ''

// Schema
const userWalletSchema = joi.object().keys({
    // partID is required
    userId: joi.number().positive().required(),

    // partID is required
    amount: joi.number().positive().required(),

});

const partOrderSchema = joi.object().keys({
    jobName: joi.string().required(),
    partId: joi.number().positive().required(),
    userId: joi.number().positive().required(),
    qty: joi.number().positive().required(),
});

// Controller class for handling user wallet operation
class WalletController {


    constructor() {
    }

    async getUserWalletData(request, response) {
        try {
            let partService = new Service()
            let responseObj = await partService.getWallet(request.query.userId);

            if (request.header('Accept').includes('application/json')) {
                response.send(responseObj);
            } else {
                response.render('list', { wallet: responseObj });
            }

        } catch (e) {
            console.error(e);
            response.render('error', { error: e.error });
        }
    }

    async addUserWallet(request, response) {

        try {
            // validating the user wallet body against the schema
            joi.validate(request.body, userWalletSchema, async (err, value) => {

                //If schema validation fails, send error response
                if (err) {
                    console.log(err)
                    var message = err;
                    response.render('error', { error: message });
                }
            })

            // If schema validation passes, proceed with the service call.
            let userWallet = {
                userId: request.body.userId,
                amount: request.body.amount
            }

            console.log(`Calling service method for creating the user wallet: ${userWallet.userId}`)

            let walletService = new Service()
            let responseObj = await walletService.createUserWallet(userWallet);

            if (request.header('Accept').includes('application/json')) {
                response.send(responseObj);
            }
            else {
                var message = responseObj.info + 'Please click on below button to add more user wallet.'
                response.render('success', { success: message });
            }

        } catch (e) {
            console.error(e);
            response.render('error', { error: e.error });
        }
    }

    async editWallet(request, response) {
        try {
            response.render('edit', { userId: request.body.userId });
        } catch (e) {
            console.error(e);
            response.render('error', { error: e.error });
        }
    }

    async edit(request, response) {
        try {
            let walletService = new Service()
            let responseObj = await walletService.updateWallet(request.body.userId, request.body.amount);
            return response.redirect(awsLambdaPath + '/wallet');
        } catch (e) {
            console.error(e);
            response.render('error', { error: e.error });
        }
    }



}
module.exports = WalletController
