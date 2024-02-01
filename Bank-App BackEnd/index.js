//Craete Server using Express

//1.Import Express
const express = require('express');
//4.Import cors
const cors = require('cors')
//import logic.js
const logic=require('./services/logic')

//import jwt token
const jwt=require('jsonwebtoken');

//2.Create Server using Express
const server = express() ;

//5.using cors in server app
server.use(cors({
    origin:'http://localhost:4200'
}))

//6.To parse the json data to js in server app
server.use(express.json())

//3.setup port for server app
server.listen(5000,()=>{
    console.log('server listening on port 5000');
})

// //7.to resolve client request in server
// server.get('/',(req,res)=>{
//     res.send('get method')
// })



//application specific middleware
const appMiddleware=(req,res,next)=>{
    console.log('application specific middleware');
    next();
}
server.use(appMiddleware)


//router specific middleware
const jwtMiddleware=(req,res,next)=>{
    //middleware for verifying token to check user is logged in or not
    console.log('router specific middleware');
    //get the token from request header
    const token=req.headers['verify-token']
    console.log(token);
   
    //verify the token
    try{
        const data=jwt.verify(token,'superkey2023')
        console.log(data);
        req.currentAcno=data.loginAcno
        next();
       
    }
    catch{
        res.status(401).json({message:"please login ....."})
    }

}


//register-post
server.post('/register',(req,res)=>{
    console.log("inside register api");
    console.log(req.body);

    //logic for register

    logic.register(req.body.acno,req.body.password,req.body.username).then((result)=>{
        res.status(result.statusCode).json(result)
    })
  
})


//login

server.post('/login',(req,res)=>{
    console.log('inside login api');
    console.log(req.body);
    logic.login(req.body.acno,req.body.password).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

//balance enquiry

server.get('/balance/:acno',jwtMiddleware,(req,res)=>{
    console.log('Inside the getbalance api');
    console.log(req.params);
    logic.getBalance(req.params.acno).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

//fund transfer
server.post('/fund-transfer',jwtMiddleware,(req,res)=>{
    console.log('Inside the fundtransfer api');
    console.log(req.body);
    logic.fundTransfer(req.currentAcno,req.body.password,req.body.toAcno,req.body.amount).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})


//get transactions
server.get('/get-transaction',jwtMiddleware,(req,res)=>{
    console.log('Inside the transaction api');
    logic.getTransactions(req.currentAcno).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

//deleteaccount
server.delete('/delete-account',jwtMiddleware,(req,res)=>{
    console.log('inside the delete ac api');
    logic.deleteMyAccount(req.currentAcno).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})