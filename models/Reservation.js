const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reservationSchema = Schema({
    reservationId: { type: String },
    reservationDate: { type: Date },            // 전시의 경우 특정 날짜가 없으므로 required 제외
    totalPrice: { type: Number, default: 0, required: true },
    ticketNum: { type: Number, required: true, default: 1 },
    isCanceled: { type: Boolean, default: false },

    userId: { type: mongoose.ObjectId, ref: User },

    ticket: [{
        SeqId: { type: String, required: true },
        SeqPrice: { type: Number, required: true },
        SeqImage: { type: String, required: true },
        SeqTitle: { type: String, required: true },
        SeqLocation: { type: String, required: true },
        SeqFrom: { type: String, required: true },
        SeqTo: { type: String, required: true }
    }],

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

