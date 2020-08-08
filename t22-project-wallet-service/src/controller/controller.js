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

// Controller class for handling user operation
class Controller {


    constructor() {
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
            var message = responseObj.info + 'Please click on below button to add more user wallet.'
            response.render('success', { success: message });

        } catch (e) {
            console.error(e);
            response.render('error', { error: e.error });
        }
    }

    async editProcess(request, response) {
        try {
            response.render('edit', { partId: request.body.partId });
        } catch (e) {
            console.error(e);
            response.render('error', { error: e.error });
        }
    }

    async edit(request, response) {
        try {
            let responseObj = await global.partService.editPart(request.body.partId, request.body.quantity);
            return response.redirect(awsLambdaPath + '/parts');
        } catch (e) {
            console.error(e);
            response.render('error', { error: e.error });
        }
    }

    async delete(request, response) {
        try {
            let responseObj = await global.partService.deletePart(request.body.partId);
            return response.redirect('/parts');
        } catch (e) {
            console.error(e);
            response.render('error', { error: e.error });
        }
    }

    async getUserWalletData(request, response) {
        try {
            let partService = new Service()
            let responseObj = await partService.getPartsByID(request.query.partId);

            if (request.header('Accept').includes('application/json')) {
                response.send(responseObj);
            } else {
                response.render('list', { parts: responseObj });
            }

        } catch (e) {
            console.error(e);
            response.render('error', { error: e.error });
        }
    }

    async getPartList(request, response) {
        try {

            let partIdList = request.body.partIdList

            if (partIdList === undefined || partIdList.length == 0) {
                let message = `partIdList cannot be empty`
                console.error(message)
                response.status(404).send({
                    message: message
                });
            }
            let partService = new Service()
            let responseObj = await partService.getPartsForJobs(request.body.partIdList);
            response.status(200).send(responseObj);
        } catch (e) {
            console.error(e);
            response.status(500).send(e);
        }
    }

    async addPartOrders(request, response) {
        try {

            // validating the partOrder body against the partOrderSchema
            joi.validate(request.body, partOrderSchema, async (err, value) => {
                //If schema validation fails, send error response
                if (err) {
                    console.log(err)
                    var message = err;
                    response.status(500).send({ error: message });
                }
            })

            let partOrder = {
                partId: request.body.partId,
                jobName: request.body.jobName,
                userId: request.body.userId,
                qty: request.body.qty
            }

            console.log(`Requesting service method for creation of the partOrder: ${partOrder.partId}, ${partOrder.jobName}, ${partOrder.userId}`)

            let responseObj = await global.partService.createPartOrder(partOrder);
            var message = responseObj.info

            response.status(200).send({ success: message });

        } catch (e) {
            console.error(e);
            response.status(500).send({ error: e.error });
        }
    }

    async getSuccesfulJobPartOrderList(request, response) {

        try {

            let responseObj = await global.partService.getSuccesfulJobPartOrderList()

            console.log(`responseObj from service:`, responseObj)

            if (request.header('Accept').includes('application/json')) {
                response.send(responseObj);
            }
            response.render('successfulOrderList', { jobs: responseObj });
        } catch (e) {
            console.error(e)
            response.render('error', { error: e.error });
        }
    }

}
module.exports = Controller
