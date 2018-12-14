var express = require("express");
var router=express.Router();
var mysql=require("mysql");
var connection=mysql.createConnection({
	   host:'localhost',
	   user:'root',
	   password:'',
	   database:'hosteldb'

});


router.get('/',function(req,res){
   res.render('pages/land');
    
});





router.get('/login',function(req,res)
	  {
	  	 res.render('pages/login');

	  })
//warden authentication
router.post('/warden',function(req,res)
	  {
	  	var id_ent=req.body.idw;
	  	var pass_ent=req.body.passwordw;
	  	connection.query("SELECT * FROM `Warden` WHERE W_id='"+id_ent+"'",function(error,result){
	  		if(error)
	  			 {
	  			 	console.log("there is some issue");
	  			 }
            else
            {
            	var x=result[0].Password;
	  				if(x==pass_ent)
	  					{console.log("successfull login");
	  				     res.redirect('/warden/'+id_ent);
	  				    }

	  				else
	  				{
	  				console.log("not correct");
	  			    res.redirect("/login");
	  			    }
            }

	  	});
	  });
//student authentication
router.post('/student',function(req,res)
	  { var id_ent=req.body.ids;
	  	var pass_ent=req.body.passwords;

	  	connection.query("SELECT password FROM `student_record` WHERE `Reg` LIKE '"+id_ent+"'",function(error,result){
	  		if(error)
	  			{   console.log("some issue is there");
	  				
	  			}
	  		else 
	  			{
	  				var x=result[0].password;
	  				if(x==pass_ent)
	  					{console.log("successfull login");
	  				    res.redirect('/'+id_ent);
	  				    }

	  				else
	  				{
	  				console.log("not correct");
	  			    res.redirect("/login");
	  			    }
	  			}
	  			
	  	});
	  	
	  })
module.exports= router;