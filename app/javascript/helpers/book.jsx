const API = {
  async destroy(id) {
    let response = await fetch(`/api/v1/books/destroy/${id}`, {
      method: 'DELETE',
      headers: { 'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content}
    })

    return response
  },
  
}

export default API