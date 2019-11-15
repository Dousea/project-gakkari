import React from "react";
import { Link } from "react-router-dom";

import "../stylesheets/books.scss";

class Books extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: []
    };
  }

  componentDidMount() {
    const url = "/api/v1/books/index";
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(response => this.setState({ books: response }))
      .catch(() => this.props.history.push("/"));
  }

  render() {
    let books = (
      <h4>Tidak ada buku yang tersedia.</h4>
    );

    if (this.state.books.length > 0)
      books = this.state.books.map(book => (
        <div key={book.id} className="col-md-4">
          <div className="card mb-4 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>{book.title}</h5>
              <Link to={`/books/${book.id}/edit`} className="btn btn-secondary">Edit</Link>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <small className="d-block text-muted">Dipublikasikan oleh</small>
                {book.publisher}
              </li>
              <li className="list-group-item">
                <small className="d-block text-muted">Dipublikasikan pada</small>
                {book.published_at}
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
            <small className="card-footer text-muted">
              {book.created_at}
            </small>
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
            <hr className="my-4" />
            <p>
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