create table Orders (orderID int PRIMARY KEY AUTO_INCREMENT, date DATETIME not null, userID int not null, amount long not null);
create table Order_Item (orderID int NOT NULL, itemID int, qty long, FOREIGN KEY (orderID) REFERENCES Orders(orderID), FOREIGN KEY(itemID) REFERENCES Items(itemID));
create table Items (itemID int PRIMARY KEY AUTO_INCREMENT, itemName varchar(50) NOT NULL, qty int not null);
