export const dateHelper = (date) => {
    let d = new Date(date)
    let year = d.getFullYear()
    let month = d.getMonth()
    let day = d.getDate()

    return new Date(year, month, day, 0,0,0,0).toDateString()
}