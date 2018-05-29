const express = require('express');
const router = express.Router();
const mysql = require('../mysql2');

router.get('/', function (req, res, next) {
	res.status(200).send({
        title: "Mysql to Api",
        autor: "Cleiton Waldemar Ribeiro <cleiton@varejointeligente.tech>",
        version: "0.0.1"
    });
});

router.get('^/:database', function (req, res, next) {
	mysql.query('show tables', req.params.database, function (result) {
		res.status(200).send({
        	tables: result,
    	});
	});
});

router.get('^/:database/:table', function (req, res, next) {
	mysql.query('select * from '+req.params.table, req.params.database, function (error, result) {

		if(error){
			res.status(401).send({
		       	msg: error.sqlMessage
		    });
		    return;
		}
		res.status(200).send({
	       	tables: result
	    });

	});
});


router.get('^/:database/:table/*', function (req, res, next) {
	var arr = req.params[0].split("/");
	mysql.get_primarykey(req.params.database, req.params.table, function(err, primary) {
		if(err) {
			console.log(err);
			return;
		}
		if(arr.length != primary.length) {
			res.status(400).send({
		       	msg: "A chave primaria enviada e diferete da tabela: "+req.params.table+". Utilize /datatabase/table/chave1/chave2/chave4",
		       	primary: primary
		    });
		    return;
		}
		mysql.build_query(req.params.database, req.params.table, arr, function (err, sql) {
			mysql.query(sql, req.params.database, function (error, result) {

				if(error){
					res.status(401).send({
				       	msg: error.sqlMessage
				    });
				    return;
				}
				res.status(200).send({
			       	result: result
			    });

			});

		});

	});

});

module.exports = router;