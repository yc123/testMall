import axios from '~plugins/axios'

export const actions = {
// 获取快讯页新闻
  loadAllNews ({ commit }, params = {}) {
    commit('newsPage/REQUEST_ALLNEWS')
    return axios.get('/api/news/created', {params})
      .then(response => {
        commit('newsPage/GET_ALLNEWS_SUCCESS', response.data)
      }, err => {
        commit('newsPage/GET_ALLNEWS_FAILURE', err)
      })
  },
  // 获取详细新闻
  loadDetailNews ({ commit }, params = {}) {
    let id = params.id
    commit('detailNews/REQUEST_DETAILNEWS', params)
    return axios.get(`/api/news/${id}`)
      .then(response => {
        commit('detailNews/GET_DETAILNEWS_SUCCESS', response.data)
      }, err => {
        commit('detailNews/GET_DETAILNEWS_FAILURE', err)
      })
  },
  // 获取热点新闻
  loadHotNews ({ commit }, params = {}) {
    commit('hotNews/REQUEST_HOTNEWS')
    return axios.get('/api/news/viewCount', {params})
      .then(response => {
        commit('hotNews/GET_HOTNEWS_SUCCESS', response.data)
      }, err => {
        commit('hotNews/GET_HOTNEWS_FAILURE', err)
      })
  }
}

