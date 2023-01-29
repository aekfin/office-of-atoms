export default {
  async http ({ state, commit, dispatch }, { method = 'get', apiPath, data, query = {}, headers = {}, responseType = 'json' }) {
    try {
      const config = { method, url: `api/${apiPath}`, data, headers, responseType, params: query }
      const res = await this.$axios(config)
      const data = res.data?.data
      return Promise.resolve({ res, data })
    } catch (err) {
      const status = err.response.status
      if (status === 401) this.$router.replace('/login/')
      return Promise.reject(err)
    }
  },
}