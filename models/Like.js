const mongoose = require("mongoose");
const User = require('./User');

const Schema = mongoose.Schema;
const likeSchema = Schema({
    userId:{
        type:mongoose.ObjectId,
        ref:User
    },

    ticket:[{
        seqId:{
            type:String,
            required:true
        },
        seqImage:{
            type:String,
        },
        seqTo:{
            type:Date,
        },
        seqFrom:{
            type:Date,
        },
        seqLocation:{
            type:String,
        },
        seqPrice:{
            type:Number,
        },
        seqTitle:{
            type:String,
            required:true
        }    
    }]
    
},{timestamps:true})

likeSchema.methods.toJson = function() {
    const obj = this._doc;
    delete obj.__v;
    delete obj.updateAt;
    delete obj.createAt;
    return obj;
};

const Like = mongoose.model("Like",likeSchema);
module.exports = Like;