const API = {
  async getID() {
    let response = await fetch("api/v1/get_session")
    let json = await response.json()
    
    return parseInt(json.id)
  },
  async create(username, password) {
    let response = await fetch("api/v1/create_session", {
      method: "POST",
      headers: {
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        session: {
          username: username,
          password: password
        }
      })
    })
    
    return response.status == 200
  },
  async destroy() {
    let response = await fetch("api/v1/delete_session", {
      method: "DELETE",
      headers: { "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content }
    })
    
    return response.status == 204
  }
}

export default API