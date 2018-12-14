
var express = require("express");
var mysql=require("mysql");
var app=express();
var bodyParser=require("body-parser");
var obj={};
var methodOverride=require("method-override");
 var wardenroutes=require('./routes/warden'),
 	 indexroutes=require('./routes/index'),
 	 studntroutes=require('./routes/student');



app.set('view engine','ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 
app.use(methodOverride('_method'));

var connection=mysql.createConnection({
	   host:'localhost',
	   user:'root',
	   password:'',
	   database:'hosteldb'

});

app.use(wardenroutes);
app.use(indexroutes);
app.use(studntroutes);



connection.connect(function(error)
	  {
	  	 if(!error)
	  	 	 {
	  	 	 	 console.log('Connected');
	  	 	 }
	  	 	else
	  	    { console.log('error');
	  	    }
	  })









app.listen(9000,function()
	  {
	  	 console.log("server has started");
	  });