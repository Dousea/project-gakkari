import React from 'react';
import TagsInput from '../components/tags_input';
import DatePicker from 'react-date-picker';
import moment from 'moment';
import { Link } from "react-router-dom";

class BookForm extends React.Component {
  constructor(props) {
    super(props);

    this.emptyAuthor = {
      id: null,
      name: '',
      errors: {},
      _destroy: false
    };

    this.state = {
      book: {
        id: null,
        title: '',
        publisher: {
          id: null,
          name: '',
          errors: {}
        },
        published_at: moment.utc(),
        errors: {},
        authors: [Object.assign({}, this.emptyAuthor)],
        subjects: []
      }
    };
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      const url = `/api/v1/show/${this.props.match.params.id}`;
  
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
  }

  handleCancel() {
    console.info('handleCancel');
    this.props.history.push('/books');
  }
  
  handleFormSubmit(event) {
    console.info('handleFormSubmit');
    event.preventDefault();

    const method = this.state.book.id ? 'PATCH' : 'POST';
    const url = this.state.book.id
      ? `/api/v1/books/${this.state.book.id}`
      : '/api/v1/books/create';

    // Evading the holy Unpermitted Parameter errors by sending only relevant keys
    const book = this.state.book;
    
    const authors = [];
    book.authors.forEach(author => {
      authors.push({ id: author.id, name: author.name, _destroy: author._destroy });
    });

    const subjects = [];
    book.subjects.forEach((value, index) => {
      subjects.push({ id: index, name: value, _destroy: false });
    });

    const body = {
      book: {
        id: book.id,
        title: book.title,
        publisher: book.publisher.name,
        published_at: book.published_at.toISOString(),
        authors_attributes: authors,
        subjects_attributes: subjects
      }
    };

    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch(url, {
      method: method,
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(json => {
        // Renaming the `authors_attributes` and `subjects_attributes`
        // properties to `authors` and `subjects` respectively
        delete Object.assign(json, { authors: json.authors_attributes }).authors_attributes;

        json.subjects = [];
        json.subjects_attributes.map(subject => {
          json.subjects.push(subject);
        })
        delete json.subjects_attributes;

        // Transform `published_at` type from string to `moment` object
        json.published_at = moment.utc(json.published_at);

        console.info(json);
        this.setState({ book: json });

        if (json.id !== null)
          return json.id;
        
        throw new Error("Submitted form was not ok.");
      })
      .then(response => this.props.history.push(`/books/${response}`))
      .catch(error => console.error(error));
  }

  handleAddAuthor(event) {
    console.info('handleAddAuthor');
    event.preventDefault();
    this.state.book.authors.push(Object.assign({}, this.emptyAuthor));
    this.setState({ book: this.state.book });
  }

  handleRemoveAuthor(event, author) {
    console.info('handleRemoveAuthor');
    event.preventDefault();
    author._destroy = true;
    this.setState({ book: this.state.book });
  }

  handleAuthorNameChange(event, author) {
    console.info('handleAuthorNameChange');
    author.name = event.target.value;
    this.setState({ book: this.state.book });
  }

  handleBookTitleChange(event) {
    console.info('handleBookTitleChange');
    this.state.book.title = event.target.value;
    this.setState({ book: this.state.book });
  }

  handleBookPublisherChange(event) {
    console.info('handleBookPublisherChange');
    this.state.book.publisher.name = event.target.value;
    this.setState({ book: this.state.book });
  }

  handleBookPublishedDateChange(date) {
    this.state.book.published_at = moment.utc(date);
    this.setState({ book: this.state.book });
  }

  handleSubjectTagAdd(index, tag) {
    console.info('handleSubjectTagAdd');
    this.state.book.subjects.push(tag);
    console.info(index, tag);
  }

  handleSubjectTagRemove(index) {
    console.info('handleSubjectTagRemove');
    this.state.book.subjects.splice(index, 1);
    console.info(index);
  }

  renderAuthorInlineError(author) {
    if (author.errors.name) {
      return (
        <div className="inline-error alert alert-danger">
          {author.errors.name.join(', ')}
        </div>
      );
    } else {
      return null;
    }
  }

  renderBookTitleInlineError() {
    if (this.state.book.errors.title) {
      return (
        <div className="inline-error alert alert-danger">
          {this.state.book.errors.title.join(', ')}
        </div>
      );
    } else {
      return null;
    }
  }

  renderBookPublisherInlineError() {
    if (this.state.book.publisher.errors.name) {
      return (
        <div className="inline-error alert alert-danger">
          {this.state.book.publisher.errors.name.join(', ')}
        </div>
      );
    } else {
      return null;
    }
  }

  renderSubjectsForm() {
    let tags = [];

    this.state.book.subjects.map((subject) => {
      tags.push(subject.name);
    })
    
    return (
      <div className="subject-tags">
        <TagsInput onAddTag={(index, name) => this.handleSubjectTagAdd(index, name)}
                   onRemoveTag={(index) => this.handleSubjectTagRemove(index)}
                   handleKey=","
                   placeholder="Press comma to add subject"
                   tags={tags} />
      </div>
    )
  }

  renderAuthorsForm() {
    return this.state.book.authors.map((author, index) => {
      if (author._destroy === false) {
        return (
          <div className="author-form" key={index}>
            <div className="form-group">
              <div className="clearfix" style={{ marginBottom: 5 }}>
                <input
                  onChange={event => this.handleAuthorNameChange(event, author)}
                  type="text"
                  value={author.name}
                  className="form-control"
                />
                <button
                  className="btn btn-danger"
                  style={{ padding: '5px 10px', float: 'right' }}
                  onClick={event => this.handleRemoveAuthor(event, author)}>
                  Remove
                </button>
              </div>
              {this.renderAuthorInlineError(author)}
            </div>
          </div>
        );
      } else {
        return null;
      }
    });
  }

  renderPublishedDatePickerForm() {
    return (
      <div>
        <DatePicker
          onChange={date => this.handleBookPublishedDateChange(date)}
          value={this.state.book.published_at.local().toDate()}
          maxDate={moment().toDate()}
        />
      </div>
    )
  }

  render() {
    return (
      <div className="BookForm">
        <form>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              onChange={event => this.handleBookTitleChange(event)}
              value={this.state.book.title}
              className="form-control"
            />
            {this.renderBookTitleInlineError()}
          </div>
          <div className="form-group">
            <label>Publisher</label>
            <input
              type="text"
              onChange={event => this.handleBookPublisherChange(event)}
              value={this.state.book.publisher.name}
              className="form-control"
            />
            {this.renderBookPublisherInlineError()}
          </div>
          <div className="form-group">
            <label>Published at</label>
            {this.renderPublishedDatePickerForm()}
          </div>
          <hr />
          <div className="authors-fieldset">
            <label>Authors</label>
            {this.renderAuthorsForm()}
            <button
              className="btn btn-success"
              onClick={event => this.handleAddAuthor(event)}>
              Add
            </button>
          </div>
          <hr />
          <div className="subjects-fieldset">
            <label>Subjects</label>
            {this.renderSubjectsForm()}
          </div>
          <hr />
          <button
            onClick={event => this.handleFormSubmit(event)}
            className="btn btn-primary">
            Save
          </button>
          &nbsp;
          <button
            onClick={() => this.handleCancel()}
            className="btn btn-danger">
            Cancel
          </button>{' '}
        </form>
      </div>
    );
  }
}

export default BookForm;