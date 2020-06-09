import React from "react";
import moment from "moment";
import $ from "jquery";
import { Pagination } from 'semantic-ui-react';

import BookForm from "./book-form";

import "../stylesheets/pagination.scss";
import "../stylesheets/books.scss";

class Books extends React.Component {
  constructor(props) {
    super(props);

    moment.locale("id");

    this.state = {
      isLoading: false,
      activePage: 1,
      totalPages: 1,
      books: []
    };
  }

  handleDeleteBook(bookId) {
    fetch(`/api/v1/books/destroy/${bookId}`, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        let alertMessage;
        
        if (response.ok) {
          alertMessage = "Buku telah berhasil dihapus.";
          
          this.handlePage(1);
        } else
          alertMessage = "Buku telah gagal dihapus.";

        $("#alert-toast #alert-toast-text").text(alertMessage);
        $("#alert-toast").toast("show");
      });
  }

  handlePage(activePage) {
    this.setState({ isLoading: true });
    fetch(`/api/v1/books/index?page=${activePage}`)
      .then(response => response.json())
      .then(json => this.setState({
        isLoading: false,
        activePage: json.page,
        totalPages: json.pages,
        books: json.books
      }));
  }

  componentDidMount() {
    this.handlePage(this.state.activePage);
  }

  render() {
    let pagination = (
      <Pagination
        className="mx-auto"
        onPageChange={(_, { activePage }) => this.handlePage(parseInt(activePage, 10))}
        siblingRange="2"
        activePage={this.state.activePage}
        totalPages={this.state.totalPages}
      />
    );

    let books = (
      <>
        <div className="d-flex justify-content-center mb-2">
          <h4 className="text-center">Tidak ada buku yang tersedia.</h4>
        </div>
      </>
    );

    if (this.state.books.length > 0)
      books = (
        <div className="row mt-2">
          {this.state.books.map(book => (
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
                    <button type="button" className="btn btn-outline-secondary" data-toggle="modal" data-target="#book-form-modal" data-id={book.id}>Sunting</button>
                    <button type="button" className="btn btn-outline-danger" onClick={() => this.handleDeleteBook(book.id)}>Hapus</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    
    return (
      <div id="content" aria-live="polite" aria-atomic="true" className="position-relative">
        <div id="alert-toast" className="toast" role="alert" data-delay="3000" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <strong id="alert-toast-text" className="mr-auto" />
            <button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
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
        <div className="pt-2 pb-4 bg-light">
          <div className="container">
            {pagination}
            {
              this.state.isLoading
              ? <div className="my-5 d-flex justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              : books
            }
            {pagination}
            <BookForm />
          </div>
        </div>
      </div>
    );
  }
}

export default Books;