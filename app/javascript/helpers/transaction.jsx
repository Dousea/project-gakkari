const API = {
  async getPage(page) {
    let response = await fetch(`/api/v1/transactions?page=${page}`)
    let json = await response.json()
    return json
  }
}

export default API