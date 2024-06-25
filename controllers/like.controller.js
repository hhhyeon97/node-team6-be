const Like = require('../models/Like');

const likeController = {}

likeController.addLikeToList = async(req,res)=>{
    try{
        const {userId} = req;
        const {seqId,seqImage,seqTo,seqFrom,seqLocation,seqTitle} = req.body;
        let like = await Like.findOne({userId});
        if(!like) {
            like = new Like({userId});
            await like.save();
        }

        const existLike = like.items.find(
            (item) => item.seqId === seqId
        );
        if(existLike) {
            throw new Error("이미 찜한 상품입니다.");
        }
        
        like.items = [...like.items,{seqId,seqImage,seqTo,seqFrom,seqLocation,seqTitle}];
        await like.save();
        res.status(200).json({status:"success",data:like});
    }catch(error){
        res.status(400).json({status:"fail",error:error.message});
    }
}

likeController.getLikeListById = async(req,res)=>{
    try{
        const {userId} = req;
        const likeList = await Like.findOne({userId});
        res.status(200).json({status:"success",data:likeList.items});
    }catch(error){
        res.status(400).json({status:"fail",error:error.message});
    }
}

likeController.deleteLikeItem = async(req,res)=> {
    try{
        const {id} = req.params;
        const {userId} = req;
        const like = await Like.findOne({userId});
        like.items = like.items.filter((item)=> !item._id.equals(id));
        await like.save();
        res.status(200).json({status:"success",data:like});
    }catch(error){
        res.status(400).json({status:"fail",error:error.message});
    }
}

module.exports = likeController;