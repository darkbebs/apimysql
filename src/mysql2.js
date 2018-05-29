var mysql = require('mysql');
var config = require('../bin/config.json');

var connect = function (database)
{
	var con = mysql.createConnection({
  		host: config.db.host,
  		user: config.db.user,
  		password: config.db.password,
  		database: database
	});

	con.connect(function(err) {
  	if (err) throw err;
  		console.log("Connected!");
	});
	return con;
}

var query = function (query, database, callback)
{
	console.log("Query: "+query);
	var con = this.connect(database);
	con.query(query, function (err, result, fields) {
	    if (err){
	    	callback(err, result);
	    	return;
	    } 
	    	// console.log(result);
	    	callback(err, result);
  	});
}

function isPrimary(value) {
  return value.Key_name == 'PRIMARY';
}

var get_primarykey = function (database, table, callback)
{
	console.log('get_primarykey');
	var con = this.connect(database);	
	con.query("show index from "+table, database, function(err, result, field){
		var primary = result.filter(isPrimary);
		callback(err, primary);
	})

}

var build_query = function (database, table, primary_values, callback) 
{
	var sql = "select * from "+table+" where ";
	this.get_primarykey(database, table, function(err, primary)
	{
		for(var i=0; i < primary.length; i++) {
			if(i > 0) sql += " and ";
			sql += primary[i].Column_name + "=" + primary_values[i];
		}
		callback(err, sql);
	});
}

module.exports = {
  connect: connect,
  query: query,
  get_primarykey: get_primarykey,
  build_query: build_query
};