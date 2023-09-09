export default {
  isAdmin (state) {
    return state.role === 'ADMIN'
  },
  isStaff (state) {
    return state.role === 'STAFF'
  },
  isTreasury (state) {
    return state.userProfile?.isTreasury === 'true'
  },
  durableGoodCountableQuery (state) {
    return state.durableGoodCountable.reduce((query, status, i) => `${query}${i > 0 ? '&': ''}status=${status}`, '')
  },
  durableGoodSelectableOptions (state) {
    const list = state.durableGoodSelectable
    return Object.keys(list).map(key => ({ id: key, name: list[key] }))
  },
}