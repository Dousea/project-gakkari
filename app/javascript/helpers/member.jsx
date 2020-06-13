const API = {
  async getInfo(id) {
    let response = await fetch(`api/v1/members/show/${id}`, {
      method: "POST",
      headers: { "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content }
    })
    let json = await response.json()

    return json
  }
}

export default API