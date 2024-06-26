const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('../models/User');

const reservationSchema = Schema({
    reservationId: { type: String },         // 자동 생성
    reservationDate: { type: String },            // 전시의 경우 특정 날짜가 없으므로 required 제외
    totalPrice: { type: Number, default: 0, required: true },
    ticketNum: { type: Number, required: true, default: 1 },
    isCanceled: { type: Boolean, default: false },

    userId: { type: mongoose.ObjectId, ref: User },

    SeqPrice: { type: Number, required: true },

    ticket: {
        SeqId: { type: String, required: true },
        SeqImage: { type: String, required: true },
        SeqTitle: { type: String, required: true },
        SeqLocation: { type: String, required: true },
        SeqFrom: { type: String, required: true },
        SeqTo: { type: String, required: true },
        isReview:{ type: Boolean, default: false}
    },

}, { timestamps: true })

reservationSchema.methods.toJSON = function () {
    const obj = this._doc
    delete obj.__v
    delete obj.updateAt
    delete obj.createAt
    return obj
}

const Reservation = mongoose.model("Reservation", reservationSchema)
module.exports = Reservation

