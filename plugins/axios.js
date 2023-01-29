export default function ({ $axios }) {
  const authToken = typeof window !== 'undefined' ? window.localStorage.authToken : null
  if (authToken) $axios.setHeader('Authorization', `Bearer ${authToken}`)
}