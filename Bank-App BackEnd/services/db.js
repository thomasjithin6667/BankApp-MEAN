//import mongoose
const mongoose=require('mongoose');
//define connection string between mongoose and express
mongoose.connect('mongodb://localhost:27017/bankserver')
//create a model and schema for sharing data btw mongodb and express
const User=mongoose.model('User',{
    acno:Number,
    password:String,
    username:String,
    balance:Number,
    transaction:[]
})
//export the collection
module.exports={
    User

}