const Controller = require('../controller/controller.js')
const UserController = require('../controller/userController.js')
const dotenv = require('dotenv')
dotenv.config()

const routes = (app) => {

    app.route('/')
        .get((request, response) => {
            response.render('home')
        })

    app.route('/viewJobs')
        .get((request, response) => {
            var controller = new Controller()
            controller.getJobsList(request, response)
        })

    app.route('/add')
        .post(async (request, response) => {
            var controller = new Controller()
            controller.add(request, response)
        });

    app.route('/login')
        .get((request, response) => {
            response.render('login')
        })

    app.route('/register')
        .get((request, response) => {
            response.render('register')
        })

    app.route('/placeOrder')
        .get((request, response) => {
            var controller = new Controller()
            controller.getItemsList(request, response)
        })

    app.route('/login')
        .post(async (request, response) => {
            let userController = new UserController()
            userController.validateUser(request, response)
        })

    app.route('/register')
        .post(async (request, response) => {
            let userController = new UserController()
            userController.registerUser(request, response)
        })

    app.route('/logout')
        .get(async (request, response) => {
            let userController = new UserController()
            userController.logoutUser(request, response)
        })

    app.route('/searchJob')
        .get((request, response) => {
            response.render('getJob')
        })

    app.route('/searchJob')
        .post((request, response) => {
            var controller = new Controller()
            controller.searchJob(request, response)
        })

    app.route('/viewJob')
        .post(async (request, response) => {
            var controller = new Controller();
            controller.viewJob(request, response)
        });

    app.route('/fulfillOrder')
        .post(async (request, response) => {
            var controller = new Controller();
            controller.fulfillOrder(request, response)
        });

    app.route('/jobSearchHistory')
        .get(async (request, response) => {
            var controller = new Controller();
            controller.getJobSearchHistory(request, response)
        });

    app.route('/jobOrderHistory')
        .get(async (request, response) => {
            var controller = new Controller();
            controller.getJobOrderHistory(request, response)
        });

}
module.exports = routes
