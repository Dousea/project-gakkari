import React from "react";
import { Link } from "react-router-dom";

class Book extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      book: {
        title: '',
        publisher: {
          name: '',
        },
        published_at: new Date(),
        authors: [],
        subjects: []
      }
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { id }
      }
    } = this.props;

    const url = `/api/v1/show/${id}`;

    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(response => this.setState({ book: response }))
      .catch(() => this.props.history.push("/books"));
  }

  handleEditBook() {
    console.info('handleEditBook');
    this.props.history.push(`/books/${this.props.match.params.id}/edit`);
  }

  handleDeleteBook() {
    console.info('handleDeleteBook');
    
    const {
      match: {
        params: { id }
      }
    } = this.props;
    const url = `/api/v1/destroy/${id}`;
    const token = document.querySelector('meta[name="csrf-token"]').content;

    fetch(url, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(() => this.props.history.push("/books"))
      .catch(error => console.error(error.message));
  }

  render() {
    const { book } = this.state;

    return (
      <div className="">
        <div className="container py-5">
          <div className="row">
            <div className="col-sm-12 col-lg-3">
              <h1 className="">{book.title}</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-lg-2">
              <button type="button"
                      className="btn btn-secondary"
                      onClick={() => this.handleEditBook()}>
                Edit Book
              </button>
              <button type="button"
                      className="btn btn-danger"
                      onClick={() => this.handleDeleteBook()}>
                Delete Book
              </button>
            </div>
          </div>
          <Link to="/books" className="btn btn-link">
            Back to books
          </Link>
        </div>
      </div>
    );
  }

}

export default Book;