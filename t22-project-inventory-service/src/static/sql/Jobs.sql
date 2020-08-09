create database if not exists csci5409;
USE csci5409;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
CREATE TABLE IF NOT EXISTS jobs (
                                    jobName VARCHAR(45) NOT NULL,
                                    partId INT NOT NULL,
                                    qty INT,
                                    PRIMARY KEY (jobName, partId));
