const API = {
  async getPage(page) {
    let response = await fetch(`/api/v1/books/index?page=${page}`)
    let json = await response.json()
    return json
  },
  async destroy(id) {
    let response = await fetch(`/api/v1/books/destroy/${id}`, {
      method: 'DELETE',
      headers: { 'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content}
    })

    return response == 204
  },
  async getInfo(id) {
    let response = await fetch(`/api/v1/books/show/${id}`)
    let json = await response.json()
    return json
  }
}

export default API