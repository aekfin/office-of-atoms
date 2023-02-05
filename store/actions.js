export default {
  async http ({ state, commit, dispatch }, { method = 'get', apiPath, data, query = {}, headers = {}, responseType = 'json' }) {
    try {
      const config = { method, url: `api/${apiPath}`, data, headers, responseType, params: query }
      const res = await this.$axios(config)
      return Promise.resolve({ res, data: res.data?.data || res.data })
    } catch (err) {
      const status = err.response.status
      if (status === 401) {
        this.$router.replace('/login/')
      }
      await dispatch('snackbar', { text: `<b>Error ${status}: </b> ${err.response.statusText}`, props: { color: 'red', top: true } })
      console.log(err)
      return Promise.reject(err)
    }
  },
  async snackbar ({ state, commit, dispatch }, { text = 'Success', props = { color: 'success' } }) {
    try {
      commit('SET_STATE', { name: 'snackbarText', val: text })
      commit('SET_STATE', { name: 'snackbarProps', val: props })
      commit('SET_STATE', { name: 'snackbarVisible', val: true })
      return Promise.resolve()
    } catch (err) {
      return Promise.reject(err)
    }
  },
}