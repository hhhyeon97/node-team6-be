const Reservation = require("../models/Reservation")
const { randomString } = require("../utils/randomString")

const reserveController = {}

reserveController.createReserve = async (req, res) => {
  try {
    // 프론트에서 데이터 받기 
    const { userId } = req
    const { totalPrice, ticketNum, reservationDate, SeqPrice, ticket } = req.body

    console.log('receive reservationDate:', reservationDate)
    // reserve 만들기
    const newReservation = new Reservation({
      reservationId: randomString(),
      reservationDate,
      totalPrice,
      ticketNum,
      userId,
      SeqPrice,
      ticket,
      isReview: false,
    })

    await newReservation.save()
    res.status(200).json({ status: 'success', reservationId: newReservation.reservationId })

  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message })
  }
}

// [ 나의 예매 내역 가져오기 ]
reserveController.getReserve = async (req, res) => {
  try {
    const PAGE_SIZE = 10;
    const { userId } = req;
    const { page } = req.query;

    let query = Reservation.find({ userId }).sort({ createdAt: -1 });
    let response = { status: "success" };

    if (page) {
      query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
      const totalItemNum = await Reservation.find(userId).count();
      const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
      response.totalPageNum = totalPageNum;
    }

    const myReserve = await query.exec();
    response.data = myReserve;

    if (myReserve) {
      return res.status(200).json(response);
    }
    throw new Error("예약내역이 없습니다");

  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message })
  }
}

// [ 예매상세 내역 가져오기 ]
reserveController.getReserveDetail = async (req, res) => {
  try {
    const { userId } = req;
    const reserveId = req.params.id;

    const reserve = await Reservation.findById(reserveId)
      .populate({ path: 'userId', model: 'User' })

    if (!reserve) throw new Error('예약상세 내역이 없습니다')

    res.status(200).json({ status: 'success', data: reserve })

  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message })
  }
}

// [ 예매취소(mypage) ]
reserveController.cancelReserve = async (req, res) => {
  try {
    const reserveId = req.params.id;

    // 먼저 예약을 찾아서 isCanceled 상태를 확인
    const reserve = await Reservation.findById(reserveId);

    if (!reserve) {
      throw new Error("예약이 존재하지 않습니다");
    }

    if (reserve.isCanceled) {
      throw new Error("이미 취소된 예약입니다");
    }

    // 예약을 취소 상태로 업데이트
    reserve.isCanceled = true;
    await reserve.save();

    res.status(200).json({ status: "success", data: reserve })

  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message })
  }
}

// [ 나의 예매 내역 가져오기 ] 날짜기준
reserveController.getReserveByDate = async (req, res) => {
  try {
    const PAGE_SIZE = 10;
    const { userId } = req;
    const { page } = req.query;
    const { formatDate } = req.body

    const startofDay = new Date(formatDate);
    startofDay.setHours(0, 0, 0, 0)       // 하루의 시작

    const endOfDay = new Date(formatDate);
    endOfDay.setHours(23, 59, 59, 999); // 하루의 끝

    let query = await Reservation.find({
      userId,
      reservationDate: {
        $gte: startofDay,
        $lt: endOfDay
      }
    }).sort({ createdAt: -1 });

    res.status(200).json({ status: "success", ReserveByDate: query });

  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message })
  }
}

reserveController.updateReview = async (reserveId) => {
  try {
    const reserve = await Reservation.findById(reserveId);
    if (reserve.isReview) throw new Error("이미 리뷰가 존재합니다!");
    let newReview = { ...reserve.ticket };
    newReview.isReview = true;
    reserve.ticket = newReview;
    await reserve.save();

  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = reserveController