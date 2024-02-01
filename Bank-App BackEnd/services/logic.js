//import db.js
const db = require('./db');
const jwt = require('jsonwebtoken')


const register = (acno, password, username) => {


    console.log('inside the registre function');
    //to check acno in mongodb
    return db.User.findOne({ acno }).then((response) => {
        console.log(response);
        if (response) {
            return {
                statusCode: 401,
                message: "Account Already Registered"
            }
        }
        else {
            const newUser = new db.User({
                acno, password, username, balance: 5000, transaction: []
            })
            //to store new account in mongodb
            newUser.save()
            //send response as register success to client
            return {
                statusCode: 200,
                message: "Account Added Successfully"
            }
        }
    })

}
const login = (acno, password) => {
    console.log('inside the login function');

    return db.User.findOne({ acno, password }).then((result) => {
        if (result) {
            const token = jwt.sign({ loginAcno: acno }, 'superkey2023')
            return {
                statusCode: 200,
                message: "Logged in Successfully",
                currentuser: result.username,
                token,
                currentAcno: result.acno
            }
        }
        else {
            return {
                statusCode: 401,
                message: "Encountered an Error"
            }

        }
    })

}
const getBalance = (acno) => {
    return db.User.findOne({ acno }).then((result) => {
        if (result) {
            return {
                statusCode: 200,
                balance: result.balance
            }

        } else {
            return {
                statusCode: 401,
                message: "Invalid Account Number"
            }
        }
    })

}

const fundTransfer=(fromAcno,fromAcnoPswd,toAcno,amt)=>{
    //logic of transfer
    //1conver amount to number
    let amount=parseInt(amt);
    //2 to check fromAcno in mongodb
    return db.User.findOne({acno:fromAcno,password:fromAcnoPswd}).then((debit)=>{
        if(debit){
            //to check toAcno in Mongodb
            return db.User.findOne({acno:toAcno}).then((credit)=>{
                if(credit){
                    if(debit.balance>=amount){
                        debit.balance-=amount;
                        debit.transaction.push({
                            type:'Debit',
                            amount,
                            fromAcno,
                            toAcno,

                        })
                        //save changes in mongodb
                        debit.save()

                        //update in toAcno
                        credit.balance+=amount;
                        credit.transaction.push({
                            type:'Credit',
                            amount,
                            fromAcno,
                            toAcno,

                        })
                        //save changes
                        credit.save();

                        //send response to client
                        return{
                            statusCode:200,
                            message:'fund Transfer Successfull'
                        }

                    }
                    else{
                        return{
                            statusCode:401,
                            message:'Insufficient Funds'
                        }
                    }

                }
                else{
                    return{
                        statusCode:401,
                        message:'Invalid Credit Details'

                    }
                }
                

            })
        }
        else{
            return{
                statusCode:401,
                messsage:'Invalid Debit Details'
            }
        }
    })
}

const getTransactions=(acno)=>{
    //gdet all transaction from mongodb
    //check acno mongodb
    return db.User.findOne({acno}).then((result)=>{
        if(result){
            return{
                statusCode:200,
                transaction:result.transaction
            }
        }else{
            return{
                statusCode:404,
                message:"Invalid Data"
            }
        }

    })
}

const deleteMyAccount=(acno)=>{
    return db.User.deleteOne({acno}).then((result)=>{
        return{
            statusCode:200,
            message:"your account has been deleted"
        }
    })
}

module.exports = {
    register,
    login,
    getBalance,
    fundTransfer,
    getTransactions,
    deleteMyAccount,
}
