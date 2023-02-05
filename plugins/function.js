import Vue from 'vue'

const Fn = {
  getPrice (number) {
    return parseFloat(number)?.toFixed(2)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'Error Number'
  },
  checkEmailFormat (email) {
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  },
}

Vue.prototype.$fn = Fn
export default Fn