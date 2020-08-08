create Table wallet  (
  walletId int AUTO_INCREMENT,
  userId int,
  amount float(10,2) NOT NULL DEFAULT 00.00,
  PRIMARY KEY (walletId, userId)
);