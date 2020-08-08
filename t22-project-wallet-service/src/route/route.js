const Controller  = require('../controller/controller.js')
const joi  = require('joi')

const routes = (app) => {

    app.route('/').get((request, response) => {
        var controller = new Controller();
        controller.getUserWalletData(request, response);
    });

    app.route('/parts').get((request, response) => {
        var controller = new Controller();
        controller.getUserWalletData(request, response);
    });

    app.route('/api/parts/getPartList')
    .post((request, response) => {
        var controller = new Controller();
        controller.getPartList(request, response);
    });


    app.route('/parts/add').get((request, response) => {
        response.render('add');
    });

    app.route('/parts/add').post(async (request, response) => {
        var controller = new Controller();
        controller.addUserWallet(request, response);
    });

    app.route('/parts/editProcess').post(async (request, response) => {
      var controller = new Controller();
      controller.editProcess(request, response);
    });

    app.route('/parts/edit').post(async (request, response) => {
        var controller = new Controller();
        controller.edit(request, response);
    });

    app.route('/parts/delete').post(async (request, response) => {
        var controller = new Controller();
        controller.delete(request, response);
    });

    app.route('/api/addPartOrders').post(async (request, response) => {
        var controller = new Controller();
        controller.addPartOrders(request, response);
    });
    
    app.route('/getSuccessfulJobList')
    .get((request, response) => {
        const controller = new Controller()
        controller.getSuccesfulJobPartOrderList(request, response)
    })
}
module.exports = routes
