const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const path = require('path');
const mysql = require('mysql');

const PORT = process.env.PORT || 5001;
const INDEX = path.join(__dirname,'./static/' , 'index.html');
const server = express();
server.use(bodyParser.json());
server.use(logger('dev'));
server.use(express.static('static'));

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "geopointsDB"
  });
con.connect(function(err) {
    if (err) console.error(err);
    console.log("Connected!");

    server.get("/", (req, res) => {
        res.send(INDEX);
    });

    server.get("/pages/getTypes", (req, res) => {
        let resp;
        let sql = 'SELECT * FROM pointTypes';
        con.query(sql, function(err, result) {
            if (err) {
                throw err;
                resp = err;
            }
            
            resp = result;
            res.status(200).send(resp);
        });
        
    });

    server.get("/pages/getPoints", (req, res) => {
        let resp;
        console.log(req.query);
        let pointCriteria = (req.query.pointType == 0) ? '' : `AND points.pointType = ${req.query.pointType}`;
        let sql = `SELECT
        points.pointId as pointId, points.name as name, 
        points.address as address, points.coordinates as coordinates, 
        pointTypes.name as pointType, points.comment as comment 
        FROM 
        points 
        JOIN 
        pointTypes 
        ON points.pointType = pointTypes.typeId 
        WHERE points.name LIKE ${req.query.name} AND
        points.address LIKE ${req.query.address} 
        ${pointCriteria}
        `;
        con.query(sql, function(err, result) {
            if (err) {
                throw err;
                resp = err;
            }
            
            resp = result;
            res.status(200).send(resp);
        });
        
    });
    server.get("/pages/getPoint/:id", (req, res) => {
        let id = parseInt(req.params.id);
        let resp;
        let sql = `SELECT * FROM points WHERE pointId=${id}`;
        con.query(sql, function(err, result) {
            if (err) {
                throw err;
                resp = err;
            }
            
            resp = result;
            res.status(200).send(resp);
        });
        
    });

    server.post("/pages/addNewType/:point", (req, res) => {
        let resp = "";
        let sql = `INSERT INTO pointTypes(name) VALUES(${req.params.point})`;
        console.log(sql);
        con.query(sql, function (err, result) {
            if (err) {
                throw err;
                resp = err;
            }
            console.log("1 record inserted");
            resp = {
                response: 'successfully saved'
            }
          });

        res.status(200).send(JSON.stringify(resp));
    });
    server.post("/pages/addNewPoint/", (req, res) => {
        let resp = "";
        console.log(req.body);
        
        let sql = `INSERT INTO points(name, address, coordinates, pointType, comment) VALUES(${req.body.name},
             ${req.body.address}, ${req.body.coordinates}, ${req.body.type}, ${req.body.comment})`;
        console.log(sql);
        con.query(sql, function (err, result) {
            if (err) {
                throw err;
                resp = err;
            }
            console.log("1 record inserted");
            resp = {
                response: 'successfully saved'
            }
            res.status(200).send(JSON.stringify(resp));
          });
    });

    server.put('/pages/updatePoint/', (req, res) =>{
        // id = parseInt(req.params.id);
        let resp = '';
        let sql = `UPDATE points SET name=${req.body.name}, address=${req.body.address}, 
            coordinates=${req.body.coordinates}, pointType=${req.body.type}, comment=${req.body.comment} WHERE pointId=${req.body.id}`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            resp = "Number of records updated: " + result.affectedRows;
            console.log(resp);
            res.status(200).send(JSON.stringify(resp));
          });
    });

    server.put('/pages/updateType/', (req, res) =>{
        // id = parseInt(req.params.id);
        let resp = '';
        let sql = `UPDATE pointTypes SET name=${req.body.name} WHERE typeId=${req.body.id}`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            resp = "Number of records upadated: " + result.affectedRows;
            console.log(resp);
            res.status(200).send(JSON.stringify(resp));
          });
    });

    server.delete('/pages/deletePoint/:id', (req, res) =>{
        id = parseInt(req.params.id);
        let resp = '';
        let sql = `DELETE FROM points WHERE pointId=${id}`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            resp = "Number of records deleted: " + result.affectedRows;
            console.log(resp);
            res.status(200).send(JSON.stringify(resp));
          });
    });
    server.delete('/pages/deleteType/:id', (req, res) =>{
        id = parseInt(req.params.id);
        let resp = '';
        let sql = `DELETE FROM pointTypes WHERE typeId=${id}`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            resp = "Number of records deleted: " + result.affectedRows;
            console.log(resp);
            res.status(200).send(JSON.stringify(resp));
          });
    });

});



server.listen(PORT, () => console.log(`Listening on ${PORT}`));