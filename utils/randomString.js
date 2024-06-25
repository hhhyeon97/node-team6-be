const randomString = () => {
    const randomString_text = Array.from(Array(10), () =>
        Math.floor(Math.random() * 36).toString(36)
    ).join("")

    return randomString_text
}   // reservationId 생성

module.exports = { randomString }