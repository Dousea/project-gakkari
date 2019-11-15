import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";

import "../stylesheets/books.scss";

class Books extends React.Component {
  constructor(props) {
    super(props);

    moment.locale("id");

    this.state = {
      books: []
    };
  }

  handleDeleteBook(bookId) {
    fetch(`/api/v1/destroy/${bookId}`, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.ok) return this.setState(this.state);
        throw new Error("Network response was not ok.");
      })
      .catch(error => console.error(error.message));
  }

  componentDidMount() {
    fetch("/api/v1/books/index")
      .then(response => response.json())
      .then(json => this.setState({ books: json }));
  }

  render() {
    let books = (
      <h4>Tidak ada buku yang tersedia.</h4>
    );

    if (this.state.books.length > 0)
      books = this.state.books.map(book => (
        <div key={book.id} className="col-lg-4">
          <div className="card mb-4 shadow-sm">
            <h5 className="card-header">{book.title}</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <small className="d-block text-muted">Dipublikasikan oleh</small>
                {book.publisher}
              </li>
              <li className="list-group-item">
                <small className="d-block text-muted">Dipublikasikan pada</small>
                {moment(book.published_at).local().format("LL")}
              </li>
              <li className="list-group-item">
                <small className="d-block text-muted">Ditulis oleh</small>
                {book.authors.join(",")}
              </li>
              <li className="list-group-item">
                <small className="d-block text-muted">Subyek</small>
                {book.subjects.join(",")}
              </li>
            </ul>
            <div className="card-footer d-flex justify-content-between">
              <small className="d-none d-sm-block text-muted">Diperbaharui<br/>{moment(book.updated_at).fromNow()}</small>
              <div className="btn-group">
                <Link to={`/books/${book.id}/edit`} className="btn btn-outline-secondary">Sunting</Link>
                <button type="button" className="btn btn-outline-danger" onClick={() => this.handleDeleteBook(book.id)}>Hapus</button>
              </div>
            </div>
          </div>
        </div>
      ));
    
    return (
      <>
        <section className="jumbotron jumbotron-fluid text-center">
          <div className="container">
            <h1 className="jumbotron-heading">Katalog</h1>
            <p className="lead text-muted">
              Persediaan buku yang ada dalam Perpustakaan Gakkari.
              Rincian buku juga ditampilkan.
            </p>
            <hr className="d-none d-sm-block my-4" />
            <p className="d-none d-sm-block">
              Jika ada kesalahan tolong hubungi staff kami atau
              jadilah anggota dalam Perpustakaan Gakkari!
            </p>
          </div>
        </section>
        <div className="album py-5 bg-light">
          <div className="container">
            <div className="row">
              {books}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Books;