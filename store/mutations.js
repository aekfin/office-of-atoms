export default {
  SET_STATE (state, { name, key, key2, val }) {
    if (key2) state[name][key][key2] = val
    else if (key) state[name][key] = val
    else state[name] = val
  },
  TOGGLE_NOTI (state) {
    state.approveRequestTrigger = !state.approveRequestTrigger
  }
}