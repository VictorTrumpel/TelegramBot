class SubDate {
  #SUB_DAYS = 30

  getMDYNow() {
    const date = new Date()

    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    return `${month}/${day}/${year}`
  }

  getMDYHMSNow() {
    const day = this.getMDYNow()

    const date = new Date()

    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()

    return `${day} ${hours}:${minutes}:${seconds}`
  }

  isSubActual(date = '') {
    if (!date)
      return false

    const nowDate = this.getMDYNow(new Date())

    const days = this.getBetweenDays(date, nowDate)

    return days <= this.#SUB_DAYS
  }

  getBetweenMinutes(start = '', end = '') {
    const date1 = new Date(start)
    const date2 = new Date(end)

    const differenceMS = date1 - date2

    const differenceMinutes = differenceMS / (1000 * 60)

    return differenceMinutes
  }

  getBetweenDays(start = '', end = '') { 
    const date1 = new Date(start)
    const date2 = new Date(end)
    
    // One day in milliseconds 
    const oneDay = 1000 * 60 * 60 * 24; 
    
    // Calculating the time difference between two dates 
    const diffInTime = date2.getTime() - date1.getTime()
    
    // Calculating the no. of days between two dates 
    const diffInDays = Math.round(diffInTime / oneDay)
    
    return diffInDays
  } 
} 

module.exports = SubDate