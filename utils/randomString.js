const StringDateformat = (value) => {
    if (value) {
        const date = value

        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const formattedDate = `${year}${month}${day}`;

        return formattedDate
    }
    return ''
}

const randomString = () => {
    const randomString_text = Array.from(Array(10), () =>
        Math.floor(Math.random() * 36).toString(36)
    ).join("")

    const today = StringDateformat(new Date()).toString()

    const formattedId = 'RES' + today + '-' + randomString_text.toUpperCase();

    return formattedId
}   // reservationId 생성

module.exports = { randomString }