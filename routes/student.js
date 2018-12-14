var express = require("express");
var router=express.Router();
var mysql=require("mysql");
var connection=mysql.createConnection({
	   host:'localhost',
	   user:'root',
	   password:'',
	   database:'hosteldb'

});

router.get('/student/sign',function(req,res){
	res.render('pages/signstud');
});

router.post('/student/sign',function(req,res){
 	var id=req.body.id;
 	var name=req.body.name;
 	var address=req.body.address;
 	var father=req.body.father;
 	var phone=req.body.phone;
 	var department=req.body.department;
 	var room=req.body.room;
 	var block=req.body.block;
 	var password=req.body.password;
 	connection.query("INSERT INTO `student_record` (`Reg`, `Name`, `Address`, `Father_name`, `Phone`, `Department`, `Roomno`, `password`, `block`) VALUES ('"+id+"', '"+name+"', '"+address+"', '"+father+"', '"+phone+"', '"+department+"', '"+room+"', '"+password+"', '"+block+"');",function(error,result){
 			if(!error)
 			{
 				console.log("successfull entered");
 				res.redirect('/'+id);
 			}
 			else
 			{
 				console.log("not entered")
 			}
 	});

});

//student home page
router.get('/:id',function(req,res)
	 {   var id=req.params.id;
	 	
	 	 connection.query("SELECT * FROM `student_record` WHERE `Reg` LIKE '"+id+"'",function(error,result)
	 	 	 {
	 	 	 	if(!error)
	 	 	 		 {  	
                        console.log(result);
                        
	 	 	 		 	 res.render('pages/home',{data:result});
                        }

	 	 	 		 
	 	 	 		 else
	 	 	 		 	console.log("something is wrong");
	 	 	 });
	 })
//student files a complaint
router.get('/:id/maintain',function(req,res)
	  { var id=req.params.id;
	  	 connection.query("SELECT * FROM `student_record` WHERE `Reg` LIKE '"+id+"'",function(error,result)
	 	 	 {
	 	 	 	if(!error)
	 	 	 		 {  	
                        console.log(result);
                        
	 	 	 		 	 res.render('pages/maintain',{data:result});
                        }

	 	 	 		 
	 	 	 		 else
	 	 	 		 	console.log("something is wrong");
	 	 	 });
   		
	  });
router.post('/:id/maintain',function(req,res)
	 {
        var id=req.params.id;
        var desc=req.body.descrip;


        connection.query("SELECT * FROM `student_record` WHERE `Reg` LIKE '"+id+"'",function(error,result)
	 	 	 {
	 	 	 	if(!error)
	 	 	 		 {  	
                        
                        connection.query("INSERT INTO `maintenance` (`Room_no`, `Block`, `Description`) VALUES ('"+result[0].Roomno+"', '"+result[0].block+"', '"+desc+"')",function(req,res)
                        {
                        	 if(!error)
                        	 	 {
                        	 	 	 console.log("inserted into mainteneance");

                        	 	 }
                        	 else
                        	 	console.log("some error");
                        });
	 	 	 		 	 
                     }

	 	 	 		 
	 	 	 		 else
	 	 	 		 	console.log("something is wrong");
	 	 	 });


        res.redirect('/'+id);

	 });



router.get('/:id/gatepass',function(req,res){
   var id=req.params.id;
   connection.query("SELECT * FROM `student_record` WHERE Reg='CSE16079' ",function(error,result){
   		if(!error)
                        	 	 {
                        	 	 	 res.render('pages/gatepass',{data:result});

                        	 	 }
                        	 else
                        	 	console.log("some error");
   })
   
    

 
});

router.post('/student/:id/special',function(req,res){
	var id=req.params.id;
	var outdatime=req.body.outdatime;
	var indatime=req.body.indatime;
	var duty=req.body.duty;
	connection.query("INSERT INTO `gatepassd` (`Reg`, `Ininfo`, `Outinfo`, `Status`) VALUES ('"+id+"', '"+indatime+"', '"+outdatime+"', '0');",function(error,result){
				if(!error)
                        	 	 {
                        	 	 	 console.log("gatepassd inserted into table");

                        	 	 }
                        	 else
                        	 {	
                        	 	res.redirect('/'+id+'/gatepass');
                        	 	console.log("gatepassd not entered");
                        	 }
                        	 	
	});


	connection.query("INSERT INTO `special` (`Reg`, `Duty`) VALUES ('"+id+"', '"+duty+"')",function(error,result){
							if(!error)
                        	 	 {
                        	 	 	 console.log("special inserted into table");

                        	 	 }
                        	 else
                        	 {
                        	 	res.redirect('/'+id+'/gatepass');
                        	 	console.log("Emergency not entered");
                        	 }
                        	 	
	});
	connection.query("SELECT gatepassd.Ininfo,gatepassd.Outinfo,gatepassd.Status,gatepassd.Reg,special.Duty FROM gatepassd INNER JOIN special ON gatepassd.Reg=special.Reg;",function(error,result){
							if(!error)
                        	 	 {
                        	 	 	 
                        	 	 	res.render('pages/specialview',{data:result});
                        	 	 }
                        	 else
                        	 	console.log("not rendering specialview");
	});

});




router.post('/student/:id/general',function(req,res){
	var id=req.params.id;
	var outdatime=req.body.outdatime;
	var indatime=req.body.indatime;
	var typee=req.body.typee;
	var reason=req.body.reason;
	connection.query("INSERT INTO `gatepassd` (`Reg`, `Ininfo`, `Outinfo`, `Status`) VALUES ('"+id+"', '"+indatime+"', '"+outdatime+"', '0');",function(error,result){
				if(!error)
                        	 	 {
                        	 	 	 console.log("gatepassd inserted into table");

                        	 	 }
                        	 else
                        	 {	
                        	 	res.redirect('/'+id+'/gatepass');
                        	 	console.log("gatepassd not entered");
                        	 }
                        	 	
	});



	connection.query("INSERT INTO `general` (`Reg`, `Reason`) VALUES ('"+id+"', '"+reason+"')",function(error,result){
							if(!error)
                        	 	 {
                        	 	 	 console.log("Emergency inserted into table");

                        	 	 }
                        	 else
                        	 {
                        	 	res.redirect('/'+id+'/gatepass');
                        	 	console.log("Emergency not entered");
                        	 }
                        	 	
	});
	connection.query("SELECT gatepassd.Ininfo,gatepassd.Outinfo,gatepassd.Status,gatepassd.Reg,general.Reason FROM gatepassd INNER JOIN general ON gatepassd.Reg=general.Reg HAVING Reg='"+id+"';",function(error,result){
							if(!error)
                        	 	 {
                        	 	 	 
                        	 	 	res.render('pages/generalview',{data:result});
                        	 	 }
                        	 else
                        	 	console.log("not rendering gatepassview");
	});

});

router.get('/:id/gatepass/view',function(req,res){
	var id=req.params.id;
	connection.query("SELECT gatepassd.Ininfo,gatepassd.Outinfo,gatepassd.Status,gatepassd.Reg,general.Reason FROM gatepassd INNER JOIN general ON gatepassd.Reg=general.Reg HAVING Reg='"+id+"';",function(error,result){
							if(!error)
                        	 	 {
                        	 	 	 
                        	 	 	res.render('pages/generalview',{data:result});
                        	 	 }
                        	 else
                        	 	console.log("not rendering gatepassview");
	});
});




router.post('/student/:id/emergency',function(req,res){
	var id=req.params.id;
	var outdatime=req.body.outdatime;
	var indatime=req.body.indatime;
	var typee=req.body.typee;
	connection.query("INSERT INTO `gatepassd` (`Reg`, `Ininfo`, `Outinfo`, `Status`) VALUES ('"+id+"', '"+indatime+"', '"+outdatime+"', '0');",function(error,result){
				if(!error)
                        	 	 {
                        	 	 	 console.log("gatepassd inserted into table");

                        	 	 }
                        	 else
                        	 {	
                        	 	res.redirect('/'+id+'/gatepass');
                        	 	console.log("gatepassd not entered");
                        	 }
                        	 	
	});


	connection.query("INSERT INTO `emergency` (`Reg`, `Type`) VALUES ('"+id+"', '"+typee+"')",function(error,result){
							if(!error)
                        	 	 {
                        	 	 	 console.log("Emergency inserted into table");

                        	 	 }
                        	 else
                        	 {
                        	 	res.redirect('/'+id+'/gatepass');
                        	 	console.log("Emergency not entered");
                        	 }
                        	 	
	});
	connection.query("SELECT gatepassd.Ininfo,gatepassd.Outinfo,gatepassd.Status,gatepassd.Reg,emergency.Type FROM gatepassd INNER JOIN emergency ON gatepassd.Reg=emergency.Reg;",function(error,result){
							if(!error)
                        	 	 {
                        	 	 	 
                        	 	 	res.render('pages/emergencyview',{data:result});
                        	 	 }
                        	 else
                        	 	console.log("not rendering gatepassview");
	});

});






router.get('/:id/fees',function(req,res)
	  { var id=req.params.id;
	  	 connection.query("SELECT fees.Reg,fees.Reg,fees.Hostel,fees.Mess,student_record.Name,student_record.Roomno FROM fees INNER JOIN student_record ON fees.Reg=student_record.Reg HAVING Reg='"+id+"'",function(error,result)
	 	 	 
	 	 	 {
	 	 	 	if(!error)
	 	 	 		 {  	
                       
                         res.render('pages/fees',{data:result});                     
                         
                        }

	 	 	 		 
	 	 	 		 else
	 	 	 		 	console.log("something is wrong");
	 	 	 });
   		
	  });
module.exports= router;