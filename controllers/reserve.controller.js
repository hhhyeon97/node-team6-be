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
        })

        await newReservation.save()
        res.status(200).json({ status: 'success', reservationId: newReservation.reservationId })

    } catch (error) {
        return res.status(400).json({ status: "fail", error: error.message })
    }
}
// [ 나의 예매 내역 가져오기 ]
reserveController.getReserve = async (req, res) => {
  try{
    const { userId } = req;
    const myReserve = await Reservation.find({userId}).sort({ createdAt: -1 });
    if(!myReserve) throw new Error("예약내역이 없습니다");

    res.status(200).json({ status: 'success', data: myReserve })

  }catch(error){
    return res.status(400).json({ status: "fail", error: error.message })
  }
}

module.exports = reserveController