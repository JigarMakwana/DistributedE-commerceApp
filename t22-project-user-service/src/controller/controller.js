const joi = require('joi')
const Service = require('../service/service.js')
const UserService = require('../service/userService.js')
const UserController = require('../controller/userController.js')

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
            console.log(`responseObj from service:`, responseObj)

            //   const uniqueJob = [...new Map(responseObj.map(item => [item['jobName'], item])).values()]
            //   console.log(`unique job:`, uniqueJob)

            response.render('list', { items: responseObj });

        } catch (e) {
            console.error(e)
            response.render('error', { error: e.error });
        }
    }

    // Get all jobs
    async getJobsList(request, response) {

        try {
            let jobService = new Service()
            let responseObj = await jobService.getJobsList()
            console.log(`responseObj from service:`, responseObj)

            //   const uniqueJob = [...new Map(responseObj.map(item => [item['jobName'], item])).values()]
            //   console.log(`unique job:`, uniqueJob)

            response.render('list', { jobs: responseObj });

        } catch (e) {
            console.error(e)
            response.render('error', { error: e.error });
        }
    }

    // Search for a jobs
    async searchJob(request, response) {

        try {

            // validating the job search body against the schema
            joi.validate(request.body, getJobSchema, async (err, value) => {

                //If schema validation fails, send error response
                if (err) {
                    console.log(err)
                    var message = err;
                    response.render('error', { error: message });
                }
            })

            let service = new Service()
            let responseObj = await service.searchJob(request.body.jobName)
            let jobSearchRecord = service.saveJobSearchRecord(request.body.jobName)
            console.log(jobSearchRecord)

            console.log(`responseObj from service:`, responseObj)
            response.render('list', { jobs: responseObj });


        } catch (e) {
            console.error(e)
            response.render('getJob', { error: e.error });
        }
    }

    // Get all jobs
    async viewJob(request, response) {

        try {

            let userController = new UserController()
            let userSession = await userController.isUserLoggedIn(request, response)

            if (userSession) {
                let jobNameReq = request.body.jobName
                let jobList = request.body.jobs

                let jobs = JSON.parse(jobList)

                const filteredList = jobs.filter(({ jobName }) => jobName == jobNameReq);

                let partIdList = [...new Set(filteredList.map(item => item.partId))];

                let partAPIreq = {
                    "partIdList": partIdList
                }

                // calling part API for fetching part details for the job
                let service = new Service()
                let partDetailsRes = await service.getPartDetailsForJob(partAPIreq)

                if (partDetailsRes != undefined || partDetailsRes.length != 0) {
                    let result = filteredList.map((item, i) => Object.assign({}, item, partDetailsRes[i]));
                    console.log('result')
                    console.log(result)
                    response.render('viewJob', { jobs: result });
                } else {
                    response.render('viewJob', { jobs: filteredList });
                }
            }

        } catch (e) {
            console.error(e)
            response.render('error', { error: e.error });
        }
    }


    async fulfillOrder(request, response) {

        try {

            let userController = new UserController()
            let userSession = await userController.isUserLoggedIn(request, response)

            if (userSession) {
                let userService = new UserService();
                let userDBObj = await userService.fetchUserWithEmail({ "email": userSession['username'] })
                console.log(userDBObj['user_id'])

                let jobList = request.body.jobs
                let jobs = JSON.parse(jobList)

                var canFulfillOrder = true;
                jobs.forEach(function (job) {
                    if (job['qty'] > job['qoh']) {
                        canFulfillOrder = false;
                    }
                });

                if (canFulfillOrder === true) {

                    let service = new Service();

                    let jobParts = await service.getJobPartsByUserId(userDBObj['user_id']);

                    jobParts = JSON.parse(JSON.stringify(jobParts))
                    console.log(jobParts);
                    for (var jobPart of jobParts) {
                        for (var job of jobs) {
                            if (jobPart['partId'] === job['partId'] && jobPart['jobName'] === job['jobName']) {
                                response.render('viewJob', { jobs: jobs, orderFulfilled: false, message: "This Order was already fulfilled for current logged in user." });
                                return
                            }
                        }
                    }

                    for (var job of jobs) {
                        console.log(job);
                        var remaining_qty = job['qoh'] - job['qty'];
                        let partRes = await service.updatePartDetails(job['partId'], remaining_qty);
                        job['qoh'] = remaining_qty;
                        console.log(partRes);
                        let jobPartRes = await service.createJobParts(job, userDBObj['user_id'], true);
                        console.log(jobPartRes);
                        let partOrderXRes = await service.createPartOrderX(job, userDBObj['user_id']);
                        let partOrderYRes = await service.createPartOrderY(job, userDBObj['user_id']);
                    };
                    response.render('viewJob', { jobs: jobs, orderFulfilled: true });
                } else {
                    console.log("Can't fulfill order");
                    response.render('viewJob', { jobs: jobs, orderFulfilled: false, message: "Order can't be fulfilled due to Insufficient quantity of parts in stock." });
                }
            }
        } catch (e) {
            console.error(e)
            response.render('error', { error: e.error });
        }
    }

    // Get job search history
    async getJobSearchHistory(request, response) {
        try {
            let jobService = new Service()
            let responseObj = await jobService.getJobSearchHistoryList()
            console.log(`responseObj from service:`, responseObj)
            response.render('jobSearchHistory', { jobs: responseObj });

        } catch (e) {
            console.error(e)
            response.render('error', { error: e.error });
        }
    }

    // Get job search history
    async getJobOrderHistory(request, response) {
        try {
            let jobService = new Service()
            let responseObj = await jobService.getJobOrdersList()
            console.log(`responseObj from service:`, responseObj)
            response.render('jobOrders', { jobs: responseObj });

        } catch (e) {
            console.error(e)
            response.render('error', { error: e.error });
        }
    }
}
module.exports = Controller