const API = {
  async getPage(page) {
    let response = await fetch(`/api/v1/members?page=${page}`)
    let json = await response.json()
    return json
  },
  async getInfo(id) {
    let response = await fetch(`api/v1/member/${id}`)
    let json = await response.json()

    return json
  }
}

export default API