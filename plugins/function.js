import Vue from 'vue'
import moment from 'moment'
import _ from 'lodash'

const Fn = {
  getPrice (number) {
    return parseFloat(number)?.toFixed(2)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'Error Number'
  },
  checkEmailFormat (email) {
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  },
  convertDateToString (date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss')
  },
  convertStringToDate (date) {
    return new Date(date)
  },
  displayDate (date) {
    const dateFormat = moment(date)
    return `${dateFormat.format('DD-MM')}-${dateFormat.year() + 543}`
  },
  reportDate (date) {
    const dateFormat = moment(date)
    return `${dateFormat.format('DD-MM')}-${dateFormat.year() + 543}-${dateFormat.format('HH-mm')}`
  },
  getName (account) {
    return `${account.thaiFristName} ${account.thaiLastName}`
  },
  isEmpty (val) {
    return _.isEmpty(val)
  },
}

Vue.prototype.$fn = Fn
export default Fn