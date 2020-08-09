CREATE TABLE IF NOT EXISTS PartOrdersX (
partId int NOT NULL,
jobName varchar (255) NOT NULL,
userId BIGINT NOT NULL,
qty int NOT NULL,
PRIMARY KEY (partId, jobName, userId)
);