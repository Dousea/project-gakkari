import React from "react";
import BookForm from '../components/book_form';

class NewBook extends React.Component {
  render() {
    return (
      <div className="NewBook col-md-8 col-md-offset-2">
        <h2>New Book</h2>
        <BookForm history={this.props.history} match={this.props.match} />
      </div>
    );
  }
}

export default NewBook;