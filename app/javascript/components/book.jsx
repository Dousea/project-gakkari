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
              <button type="button" className="btn btn-danger">
                Delete Book
              </button>
            </div>
          </div>
          <Link to="/catalog" className="btn btn-link">
            Back to books
          </Link>
        </div>
      </div>
    );
  }

}

export default Book;