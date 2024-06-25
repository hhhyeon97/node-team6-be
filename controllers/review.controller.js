const Review = require('../models/Review');
const reviewController = {};


// 금지어 목록
const forbiddenWords = ['바보', '멍청이', '새끼'];

// [ 리뷰 생성 ]
reviewController.createReview = async(req, res)=>{
  try{
    const { userId } = req;
    let { reviewText, starRate, image, reserveId } = req.body;
    console.log('공연번호',reserveId);

    // 예매 여부 검사
    if(!reserveId) throw new Error("예매 내역이 없습니다")

    // 이미 리뷰가 존재하는지 확인
    const existingReview = await Review.findOne({ reservationId: reserveId, userId: userId });
    if (existingReview) throw new Error("이미 이 예매에 대한 리뷰를 남기셨습니다.");

    // 리뷰 내용 검사
    if(!reviewText.trim()) throw new Error("리뷰를 작성해주세요")
    if(reviewText.length < 15) throw new Error("최소 15자 이상 작성해주세요")

    // 별점 검사
    if (starRate < 0 || starRate > 5) {
      throw new Error("별점은 0에서 5 사이의 값이어야 합니다");
    }

    // 금지어 검사
    for (let word of forbiddenWords) {
      if (reviewText.includes(word)) { // 금지어 검사에 일정 횟수 걸리면 계정 정지(TO DO)
        throw new Error("부적절한 리뷰입니다");
      }
    }

    const review = new Review({reviewText, starRate, image, userId, reservationId:reserveId});
    await review.save();
    res.status(200).json({ status: "success", data: review })
    
  }catch(error){
    res.status(400).json({ status: "fail", error: error.message})
  }
}

// [ 전체 리뷰리스트 가져오기 (admin) ]
reviewController.getReviewList = async(req, res) => {
  try{
    const PAGE_SIZE = 1;
    const { page, name } = req.query;
    const cond = {
      // ...name && { name: { $regex: name, $options: "i" } },// userId 없어서 검색못함(TODO)
    };
    let query = Review.find(cond).sort({ createdAt: -1 });
    let response = { status: "success"};

    // if(page){
    //   query.skip((page-1) * PAGE_SIZE).limit(PAGE_SIZE);
    //   const totalItemNum = await Review.find(cond).count();
    //   const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
    //   response.totalPageNum = totalPageNum;
    // }
    
    const reviewList = await query.exec();
    response.data = reviewList;
    
    if(reviewList){
      return res.status(200).json(response);
    }
    throw new Error("리뷰가 없거나 잘못되었습니다");
  }catch(error){

  }
}

module.exports = reviewController;