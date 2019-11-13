import React from 'react';
import BookForm from '../components/book_form';

class EditBook extends React.Component {
  render() {
    return (
      <div className="EditBook col-md-8 col-md-offset-2">
        <h2>Edit Book</h2>
        <BookForm history={this.props.history} match={this.props.match} />
      </div>
    );
  }
}

export default EditBook;