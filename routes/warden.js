var express = require("express");
var router=express.Router();
var mysql=require("mysql");
var connection=mysql.createConnection({
	   host:'localhost',
	   user:'root',
	   password:'',
	   database:'hosteldb'

});


//sign in warden
router.get('/warden/sign',function(req,res){
	res.render('pages/signwarden');
});
//sign in post
router.post('/warden/sign',function(req,res){
	var id=req.body.id;
 	var name=req.body.name;
 	var phone=req.body.phone;
 	var email=req.body.email;
 	 var password=req.body.password;
 	 var block=req.body.block;
 	connection.query("INSERT INTO `warden` (`W_id`, `Name`, `Phone`, `Email`, `Password`) VALUES ('"+id+"', '"+name+"', '"+phone+"', '"+email+"', '"+password+"') ;",
 		function(error,result){
 			if(!error)
 			{
 				console.log("successfull entered 1st");
 				
 			}
 			else
 			{
 				console.log("not entered")
 				res.redirect('/warden/sign');
 			}
 	});
 	connection.query("INSERT INTO `hostel` (`W_id`, `Block`) VALUES ('"+id+"', '"+block+"');",function(error,result)
 	{
 		if(!error)
 			{
 				console.log("successfull entered 2nd");
 				res.redirect('/warden/'+id);
 				
 			}
 			else
 			{
 				console.log("not entered")
 				res.redirect('/warden/sign');
 			}
 	})
});

//fine form
router.get("/warden/fineform",function(req,res)
{   console.log("in the fineform");
	res.render('pages/fineform');
});
//warden adds fine post
router.post("/warden/fine/new",function(req,res)
{   
	var room=req.body.room;
	var amount=req.body.amount;
	var reason=req.body.reason;
	var id=req.body.id;
	connection.query("INSERT INTO `fine` (`Room_no`, `Amount`, `Reason`, `Status`, `W_id`) VALUES ('"+room+"', '"+amount+"', '"+reason+"', 0, '"+id+"');",function(error,result){
			if(!error)
			{	console.log("fine inserted");
			    res.redirect('/warden/'+id+'/fine');

			}
			else
				console.log("Fine already exist for that room");
	});
	
});

//warden home page 

router.get('/warden/:id',function(req,res){
	var id=req.params.id;
	 	
	 	 connection.query("SELECT * FROM `Warden` WHERE W_id='"+id+"'",function(error,result)
	 	 	 {
	 	 	 	if(!error)
	 	 	 		 {  	
                        console.log(result);
                        
	 	 	 		 	 res.render('pages/wardenhome',{data:result});
                        }

	 	 	 		 
	 	 	 		 else
	 	 	 		 	console.log("something is wrong");
	 	 	 });
});

//view all students
router.get('/warden/:id/view',function(req,res){
	var id=req.params.id;
	console.log(id);
	connection.query("SELECT * FROM `student_record` WHERE block IN (SELECT block FROM hostel WHERE W_id='"+id+"')",function(error,result){
		if(!error){
			 
			 res.render('pages/viewstud',{data:result});
			}
		else
			console.log("wrong");
	});
});
//warden views fine
router.get("/warden/:id/fine",function(req,res){
 	var id=req.params.id;
 	console.log(id);
 	connection.query("SELECT * FROM fine WHERE W_id='"+id+"'",function(error,result){  
 		if(!error){
 			 console.log(result);
 			 res.render('pages/viewfine',{data:result});
 		}
 		else
 			res.send("something went wrong");
 	});
});

//warden views maintenance
router.get("/warden/:id/maintain",function(req,res){
 	var id=req.params.id;
 	connection.query("SELECT * , '"+id+"' AS WARDEN FROM maintenance WHERE Block IN (SELECT Block FROM hostel WHERE W_id ='"+id+"')",function(error,result){  
 		if(!error){

 			console.log(result);
 			 res.render('pages/viewmaintain',{data:result});
 		}
 		else
 			res.send("something went wrong");
 	});
});

//Warden solves the complaint DELETE
router.delete("/warden/:wid/:room/settle",function(req,res)
	 {	
	 	 var wid=req.params.wid;
	 	 var room=req.params.room;
	 	 connection.query("DELETE FROM maintenance WHERE Room_no='"+room+"'",function(error,result){
	 	 	if(!error){
	 	 		res.redirect('/warden/'+wid+'/maintain');
	 	 	}
	 	 	else
	 	 		res.send("ERROR!!");
	 	 });
	 });


//warden removes fine post
router.put("/warden/:id/:room/settlefine",function(req,res){
 	var room=req.params.room;
 	var id=req.params.id;
 	connection.query("UPDATE fine SET STATUS=1 WHERE Room_no='"+room+"' ",function(error,result){
		if(!error){
			 res.redirect('/warden/'+id+'/fine');
		}
		else
			console.log("Didnt settle fine");
 	});
 	
});
//to delete fine
router.delete("/warden/:id/:room/deletefine",function(req,res){
 	var room=req.params.room;
 	var id=req.params.id;
 	connection.query("DELETE  FROM fine WHERE Room_no='"+room+"' ",function(error,result){
		if(!error){
			 res.redirect('/warden/'+id+'/fine');
		}
		else
			console.log("didnt delete fine");
 	});
 	
});

//warden views gatepassss
router.get('/warden/:id/gatepass',function(req,res){
	var id =req.params.id;
 	connection.query("SELECT * , '"+id+"' AS WARDEN  FROM gatepassd WHERE Reg IN (SELECT Reg FROM student_record WHERE block IN (SELECT block FROM hostel WHERE W_id ='"+id+"'))",function(error,result){
 		if(!error){
 			console.log(result);
			 res.render('pages/wardenpass',{data:result});
		}
		else
			console.log(" failed to render wardenpass");
 	});
});
//warden approves gp
router.put('/warden/:wid/:sid/acceptgp',function(req,res){
	var sid=req.params.sid;
	var wid=req.params.wid;
	console.log('somethins is happing');
	connection.query("UPDATE gatepassd SET Status='1' WHERE Reg='"+sid+"';",function(error,result)
	 	 	 {
	 	 	 	if(!error)
	 	 	 		 {  	
                        console.log(result);
                       
	 	 	 		 	res.redirect('/warden/'+wid+'/gatepass');
                        }

	 	 	 		 
	 	 	 		 else
	 	 	 		 	console.log("something is wrong");
	 	 	 });
});

//warden disproves gatepass
router.delete('/warden/:wid/:sid/deletegp',function(req,res){
	var sid=req.params.sid;
	var wid=req.params.wid;
	console.log('somethins is happing');
	connection.query("DELETE FROM gatepassd  WHERE Reg='"+sid+"';",function(error,result)
	 	 	 {
	 	 	 	if(!error)
	 	 	 		 {  	
                        console.log(result);
                       
	 	 	 		 	res.redirect('/warden/'+wid);
                        }

	 	 	 		 
	 	 	 		 else
	 	 	 		 	console.log("something is wrong");
	 	 	 });
});


//warden taking attendance 

router.get('/warden/:wid/attendance',function(req,res){
	var wid=req.params.wid;
	connection.query("SELECT '"+wid+"' AS WARDEN,attendance.status,student_record.Reg,student_record.Name,student_record.Roomno,attendance.Date FROM student_record INNER JOIN attendance ON student_record.Reg=attendance.Reg HAVING Reg IN (SELECT Reg FROM student_record WHERE Block IN ( SELECT Block FROM hostel WHERE W_id='"+wid+"'))",function(error,result){
		if(!error)
	 	 	 		 {  	console.log(result);
	 	 	 		 		res.render('pages/attendance',{data:result})
                        
                        }

	 	 	 		 
	 	 	 		 else
	 	 	 		 	console.log("something is wrong");
	});

});

//warden marks present
router.put('/warden/attendance/:wid/:id/present',function(req,res){
	var wid=req.params.wid;
	var id=req.params.id;
	connection.query("UPDATE attendance SET status=2 where Reg='"+id+"'",function(error,result){
		if(!error){
			res.redirect('/warden/'+wid+'/attendance');
		}
		else
		{
			console.log("failed to mark as present");
		}

	});

});

//warden marks absent
router.put('/warden/attendance/:wid/:id/absent',function(req,res){
	var wid=req.params.wid;
	var id=req.params.id;
	connection.query("UPDATE attendance SET status=1 where Reg='"+id+"'",function(error,result){
		if(!error){
			res.redirect('/warden/'+wid+'/attendance');
		}
		else
		{
			console.log("failed to mark as present");
		}

	});

});

//only present
router.post('/warden/attendancepresent',function(req,res){
	connection.query("SELECT attendance.Reg,attendance.Date,attendance.Room,attendance.Block,attendance.status,student_record.Name FROM `attendance` INNER JOIN student_record ON student_record.Reg=attendance.Reg HAVING attendance.status='2'",function(error,result){
	if(!error){
		console.log(result);
		res.render('pages/presentview',{data:result});
	}
	else
	{
		console.log("didnt redirect to present page");
	}
	});
});

//only absent /warden/attendanceabsent
router.post('/warden/attendanceabsent',function(req,res){
	connection.query("SELECT attendance.Reg,attendance.Date,attendance.Room,attendance.Block,attendance.status,student_record.Name FROM `attendance` INNER JOIN student_record ON student_record.Reg=attendance.Reg HAVING attendance.status='1'",function(error,result){
	if(!error){
		console.log(result);
		res.render('pages/absentview',{data:result});
	}
	else
	{
		console.log("didnt redirect to present page");
	}
	});
});



//warden outing 
router.get('/warden/:wid/outing',function(req,res){
		var id =req.params.wid;
		connection.query("SELECT * FROM warden  WHERE W_id='"+id+"'",function(error,result)
	 	 	 {
	 	 	 	if(!error)
	 	 	 		 {  	console.log(result);
                        res.render('pages/outingform',{data:result});
                        }

	 	 	 		 
	 	 	 		 else
	 	 	 		 	console.log("something is wrong");
	 	 	 });


		

});

//inserting data into outing table
router.post('/warden/:wid/outing',function(req,res){
	 var wid=req.params.wid;
	 var id =req.body.id;
	 var date =req.body.date;
	 var outime=req.body.outime;
	 var intime=req.body.intime;
	 var exceedtime=req.body.exceedtime;
	 var  block=req.body.block;

	 connection.query("INSERT INTO `outing` (`Reg`, `Date`, `Outime`, `Intime`, `Exceedtime`, `Block_status`) VALUES ('"+id+"', '"+date+"', '"+outime+"', '"+intime+"', '"+exceedtime+"', '"+block+"')",function(error,result){
	 				if(!error)
	 	 	 		 {  	
                           res.redirect('warden/'+wid+'/outingview');  //it will duplicate warden/:wid/warden/:wid for some reason
                        }

	 	 	 		 
	 	 	 		 else
	 	 	 		 	console.log("something is wrong");
	 });
});


//warden views the outing 
router.get('/warden/:wid/warden/:wid/outingview',function(req,res){
	var wid=req.params.wid;
	connection.query("SELECT * FROM outing WHERE Reg IN (SELECT Reg FROM student_record WHERE BLOCK IN(SELECT Block FROM hostel WHERE W_id='"+wid+"'))   ",function(error,result){
			if(!error)
	 	 	 		 {  	
                           res.render('pages/viewouting',{data:result});
                        }

	 	 	 		 
	 	 	 		 else
	 	 	 		 	console.log("something is wrong");
	});




});

module.exports = router;