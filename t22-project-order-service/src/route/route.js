const Controller = require('../controller/controller.js')
const dotenv = require('dotenv')
dotenv.config()

const routes = (app) => {

    app.route('/')
        .get((request, response) => {
            response.render('home')
        })

    app.route('/add')
        .post((request, response) => {
            var controller = new Controller()
            controller.add(request, response)
        })

    app.route('/delete/:id')
        .get(async (request, response) => {
            var controller = new Controller()
            controller.delete(request, response)
        });
}
module.exports = routes
