# dataViz
============
This code base is for a real time metrics dashboard with time sequence data

## Prerequisite
----
Installation
1. JDK 1.8
2. MySQL
3. Maven

## Setup
1. Clone code to your local machine
2. Configure your MySQL account in application.properties
3. Run "mvn compile"
4. Run "mvn test", the test cases will be triggered
5. Run "mvn spring-boot:run", a web server will be up with port 8080
6. Run the mock data generator in script/mockdata_generator.py
7. Open "http://localhost:8080" in your local browser
