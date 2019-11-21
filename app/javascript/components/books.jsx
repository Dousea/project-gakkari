import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";

import BookModal from "./book-modal";

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
        if (response.ok) {
          this.state.books = this.state.books.filter(book => book.id !== bookId);
          this.setState(this.state);
        } else
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
      <>
        <div className="d-flex justify-content-center mb-2">
          <h4 className="text-center">Tidak ada buku yang tersedia.</h4>
        </div>
      </>
    );

    if (this.state.books.length > 0)
      books = (
        <>
          <div className="row mt-2">
            {this.state.books.map(book => (
              <div key={book.id} className="col-md-6 col-lg-4">
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
                      {
                        book.authors.length > 1
                        ? <ul id="authors-list">
                            {book.authors.map((author, index) => <li key={index}>{author}</li>)}
                          </ul>
                        : book.authors[0]
                      }
                    </li>
                    <li className="list-group-item">
                      <small className="d-block text-muted">Subyek</small>
                      <ul className="subject-tags d-flex flex-wrap p-0 mb-0">
                        {book.subjects.map((subject, index) =>
                          <li className="border rounded bg-light d-flex align-items-center" key={index}>
                            {subject}
                          </li>
                        )}
                      </ul>
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
            ))}
          </div>
        </>
      );
    
    return (
      <>
        <section className="jumbotron jumbotron-fluid bg-dark text-center">
          <div className="container">
            <h1 className="jumbotron-heading text-white">Katalog</h1>
            <p className="lead text-white-50">
              Persediaan buku yang ada dalam Perpustakaan Gakkari.
            </p>
            <hr className="my-4" />
            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#book-form-modal">
              Masukkan Buku
            </button>
          </div>
        </section>
        <div className="py-5 bg-light">
          <div className="container">
            {books}
            <BookModal id="book-form-modal" />
          </div>
        </div>
      </>
    );
  }
}

export default Books;