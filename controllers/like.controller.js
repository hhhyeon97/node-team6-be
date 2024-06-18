const Like = require('../models/Like');

const likeController = {}

likeController.createLike = async(req,res)=>{
    try{
        const {userId} = req;
        const {seqId,seqImage,seqTo,seqFrom,seqLocation,seqPrice,seqTitle} = req.body;
        const like = new Like({
            userId,seqId,seqImage,seqTo,seqFrom,seqLocation,seqPrice,seqTitle
        });
        await like.save();
        res.status(200).json({status:"success",like});
    }catch(error){
        res.status(400).json({status:"fail",error:error.message});
    }
}

likeController.getLikeItems = async(req,res)=>{
    try{
        const {userId} = req;
        const likeList = await Like.find({userId});
        res.status(200).json({status:"success",data:likeList});
    }catch(error){
        res.status(400).json({status:"fail",error:error.message});
    }
}

module.exports = likeController;