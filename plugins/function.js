import Vue from 'vue'

const Fn = {
  getPrice (number) {
    return parseFloat(number)?.toFixed(2)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'Error Number'
  }
}

Vue.prototype.$fn = Fn
export default Fn