const Review = require('../models/Review');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const reviewController = {};
const reserveController = require('./reserve.controller');


// 금지어 목록
const forbiddenWords = ['바보', '멍청이', '새끼'];

// [ 리뷰 생성 ]
reviewController.createReview = async (req, res) => {
  try {
    const { userId } = req;
    let { reviewText, starRate, image, reserveId } = req.body;

    // 예매 여부 검사
    if (!reserveId) throw new Error("예매 내역이 없습니다")

    // 이미 리뷰가 존재하는지 확인
    const existingReview = await Review.findOne({ reservationId: reserveId, userId: userId });
    if (existingReview) throw new Error("이미 이 예매에 대한 리뷰를 남기셨습니다.");

    // 리뷰 내용 검사
    if (!reviewText.trim()) throw new Error("리뷰를 작성해주세요")
    if (reviewText.length < 15) throw new Error("최소 15자 이상 작성해주세요")

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

    await reserveController.updateReview(reserveId);

    const review = new Review({ reviewText, starRate, image, userId, reservationId: reserveId });
    await review.save();
    res.status(200).json({ status: "success", data: review })

  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message })
  }
}

// [ 해당 예매에 내가 쓴 리뷰가 있는지 확인 ]
// reviewController.checkReviewed = async (req, res) => {
//   try {
//     const { userId } = req;
//     let { reserveId } = req.params;
//     const existingReview = await Review.findOne({ reservationId: reserveId, userId: userId });
//     // console.log('예매공연',reserveId,'의 리뷰는',existingReview)
//     res.status(200).json({ status: "success", data: existingReview })
//     // return res.status(200).json(response.data);

//   } catch (error) {
//     res.status(400).json({ status: "fail", error: error.message })
//   }
// }

// [ 전체 리뷰리스트 가져오기 (admin) ]
reviewController.getReviewList = async (req, res) => {
  try {
    const PAGE_SIZE = 5;
    const { page, name } = req.query;

    let cond = {};

    if(name){
      // userId를 참조하여 사용자 이름 검색
      const users = await User.find({ name: { $regex: name, $options: "i" } }).select('_id');
      const userIds = users.map(user => user._id);
      // userId가 검색 조건에 포함되어야 함
      cond.userId = { $in: userIds };
    } 

    let query = Review.find(cond)
    .populate('userId')
    .populate({
      path: 'reservationId',
      populate: {
        path: 'ticket' 
      }
    })
    .sort({ createdAt: -1 });

    let response = { status: "success" };

    if(page){
      query.skip((page-1) * PAGE_SIZE).limit(PAGE_SIZE);
      const totalItemNum = await Review.find(cond).count();
      const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
      response.totalPageNum = totalPageNum;
    }

    const reviewList = await query.exec();
    response.data = reviewList;
    
    if(reviewList){
      return res.status(200).json(response);
    }
    throw new Error("리뷰가 없거나 잘못되었습니다");

  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message })
  }
}

// [ 리뷰상태 수정하기 - 숨김처리 (admin)]
reviewController.editReviewState = async (req, res) => {
  try{
    const reviewId = req.params.id;
    const { isSuspended } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
        throw new Error("리뷰가 존재하지 않습니다");
    }

    // 공지사항 수정
    review.isSuspended = isSuspended;

    await review.save();
    res.status(200).json({ status: "success", data: review });

  }catch(error){
    return res.status(400).json({ status: "fail", error: error.message })
  }
}

// [ 전체 리뷰리스트 가져오기 (detail) ]
reviewController.getAllReviewList = async (req, res) => {
  try {
    const { Id } = req.query;

    const reservationsList = await Reservation.find({ 'ticket.SeqId': Id }, '_id'); // 디테일 페이지에서의 공연 id를 가진 예약 정보만 출력 
    const reviewAllList = await Review.find().sort({ createdAt: -1 });  // 리뷰 전체 가져오기

    const reservationIds = reservationsList.map(reservation => reservation._id.toString());  // reservationId만 뽑기
    const matchingData = reviewAllList.filter(review => reservationIds.includes(review.reservationId.toString()));

    const resultData = []
    for (const review of matchingData) {
      const user = await User.findOne({ '_id': review.userId.toString() }, 'name'); // 각 userId에 대해 사용자 이름을 가져옴

      if (user) {
        resultData.push({
          ...review.toObject(),
          nickName: user.name       // 닉네임 객체 추가
        })
      }
    }

    res.status(200).json({ status: "success", matchingData: resultData });

  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message })
  }
}

// 나의 리뷰 리스트 가져오기
reviewController.getMyReviewList = async (req, res) => {
  try {
    const { userId } = req

    const reviewMyList = await Review.find({ userId }).sort({ createdAt: -1 });  // 리뷰 전체 가져오기
    console.log('reviewMyList', reviewMyList)

    const resultData = []
    for (const review of reviewMyList) {
      const performance = await Reservation.findOne({ '_id': review.reservationId.toString() }, 'ticket.SeqTitle'); // 각 userId에 대해 사용자 이름을 가져옴

      if (performance) {
        resultData.push({
          ...review.toObject(),
          SeqTitle: performance.ticket.SeqTitle,       // 공연 이름 객체 추가
        })
      }
    }

    res.status(200).json({ status: "success", data: resultData });

  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message })
  }
}

reviewController.getMainPageReview = async(req,res) => {
  try{
    const star = parseInt(req.query.starRate, 10);
    const qty = parseInt(req.query.reviewQty, 10);
    const review = await Review.find({starRate:star, isSuspended:false})
      .populate({
        path:'userId',
        select:'name image'
      })
      .populate({
        path:'reservationId',
        select:'ticket',
      })
      .sort({createdAt: -1})
      .limit(qty);
    if(!review) throw new Error("5점 리뷰가 없습니다!")
    res.status(200).json({status:"success", data:review});
  }catch(error){
    res.status(400).json({status:"fail", error:error.message})
  }
}


module.exports = reviewController;