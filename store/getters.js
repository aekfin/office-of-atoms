export default {
  isAdmin (state) {
    return state.role === 'ADMIN'
  },
  isTreasury (state) {
    return state.userProfile?.isTreasury === 'true'
  }
}