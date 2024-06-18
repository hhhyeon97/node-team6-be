const Review = require('../models/Review');
const reviewController = {};


// 금지어 목록
const forbiddenWords = ['씨발', '새끼', '좆'];

// 리뷰 생성
reviewController.createReview = async(req, res)=>{
  try{
    let { reviewText, starRate, image } = req.body;

    // 리뷰 내용 검사
    if(!reviewText.trim()) throw new Error("리뷰를 작성해주세요")
    if(reviewText.length < 15) throw new Error("최소 15자 이상 작성해주세요")

    // 별점 검사
    if (starRate < 0 || starRate > 5) {
      throw new Error("별점은 0에서 5 사이의 값이어야 합니다");
    }

    // 금지어 검사
    for (let word of forbiddenWords) {
      if (reviewText.includes(word)) { // 금지어 검사에 일정 횟수 걸리면 계정 정지
        throw new Error("부적절한 리뷰입니다");
      }
    }

    const review = new Review({reviewText, starRate, image});
    await review.save();
    res.status(200).json({ status: "success", data: review })
    
  }catch(error){
    res.status(400).json({ status: "fail", error: error.message})
  }
}

module.exports = reviewController;