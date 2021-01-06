## Distributed E-commerce Web Application

The web application follows the idea of e-commerce application where user uses the online platform for buying the products from the company. 
Project have four web services: User, Inventory, Order, and Wallet. 
All the web services have their own databases and deployed in different cloud platform. 
Moreover, project has functionalities like wallet for user, inventory which stores stock of each product and ordering the product. 
Web services communicate to one another using distributed commit protocol through Rest APIs. 
Inventory and wallet services are deployed in Elastic Beanstalk, whereas the user and order services are deployed in Google Cloud platform.

##
* Date Created: 2020-08-10
* Last Modification Date: 2021-01-05

## Authors

* Jigar Makwana – B00842568
* Monil Panchal – B00838558
* Ahsan Kamal – B00853723
* Joshin Johnson– B00845396
* Pratibha Basapure – B00847415
* Arjun Kolar Hanumappa– B00854475

#### This repo has multiple services and all of them can be executed separately. The following are the root directories based on the category.

1. [wallet service](/t22-project-wallet-service)
2. [wallet check balance aws lambda service](/t22-project-checkWalletBalance-aws-lambda-function)
3. [user service](/t22-project-user-service)
4. [inventory service](/t22-project-inventory-service)
5. [order service](/t22-project-order-service)

