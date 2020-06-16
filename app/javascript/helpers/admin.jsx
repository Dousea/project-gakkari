const API = {
  async getInfo(id) {
    let response = await fetch(`api/v1/administrator/${id}`)
    let json = await response.json()

    return json
  }
}

export default API