import React from "react";
import $ from "jquery";
import moment from "moment";

import "../stylesheets/book-form";

class BookForm extends React.Component {
  constructor(props) {
    super(props);

    moment.locale("id");

    this.emptyAuthor = {
      id: null,
      name: "",
      errors: {},
      _destroy: false
    };

    this.emptySubject = {
      id: null,
      name: "",
      errors: {},
      _destroy: false
    };

    this.resetState(true);
  }

  form() {
    return $(`#${this.props.id}`);
  }

  resetState(notMounted) {
    this.state = {
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
    };

    // We are calling `resetState` in constructor, so we need this variable
    // to determine whether it is already mounted or not so we can call
    // `setState`
    if (!notMounted)
      this.setState(this.state);
  }

  stateToJson() {
    // Evading the holy Unpermitted Parameter errors by sending only relevant keys
    const book = this.state;
    
    let authors = [];
    book.authors.forEach(author => {
      authors.push({ id: author.id, name: author.name, _destroy: author._destroy });
    });

    let subjects = [];
    book.subjects.forEach(subject => {
      // If the `id` is null and needs to be destroyed then it is still a new
      // record and doesn't need to be passed to controller
      if (!(subject.id === null && subject._destroy === true))
        subjects.push({ id: subject.id, name: subject.name, _destroy: subject._destroy });
    });

    return JSON.stringify({
      book: {
        id: book.id,
        title: book.title,
        publisher: book.publisher.name,
        published_at: book.published_at.toISOString(),
        authors_attributes: authors,
        subjects_attributes: subjects
      }
    });
  }

  jsonToState(json) {
    let state = Object.assign({}, json);

    // Renaming the `authors_attributes` and `subjects_attributes`
    // properties to `authors` and `subjects` respectively
    Object.assign(state, {
      authors: state.authors_attributes,
      subjects: state.subjects_attributes
    });
    delete state.authors_attributes;
    delete state.subjects_attributes;

    // Transform `published_at` type from string to `moment` object
    state.published_at = moment.utc(state.published_at);

    return state;
  }

  handleTitleChange(event) {
    this.state.title = event.target.value;
    this.setState(this.state);
  }

  handlePublisherNameChange(event) {
    this.state.publisher.name = event.target.value;
    this.setState(this.state);
  }

  handlePublishedAtDateMonthChange(event) {
    let dateMonthInput = $(event.target);
    
    if (dateMonthInput.val() < 1)
      dateMonthInput.val(1);
    else if (dateMonthInput.val() > this.state.published_at.local().daysInMonth())
      dateMonthInput.val(this.state.published_at.local().daysInMonth());
    else {
      let dateMonth = dateMonthInput.val();
      console.info(`handlePublishedAtDateMonthChange ${dateMonth}`);
      this.state.published_at = this.state.published_at.local().date(dateMonth).utc();
      this.setState(this.state);
    }
  }

  handlePublishedAtMonthChange(event) {
    let month = $(event.target).find("option:selected").val();
    console.info(`handlePublishedAtMonthChange ${month}`);
    this.state.published_at = this.state.published_at.local().month(month).utc();
    this.setState(this.state);
  }

  handlePublishedAtYearChange(event) {
    let yearInput = $(event.target);
    
    if (yearInput.val() < 0)
      yearInput.val(0);
    else if (yearInput.val() > this.state.published_at.local().year())
      yearInput.val(this.state.published_at.local().year());
    else {
      let year = yearInput.val();
      console.info(`handlePublishedAtYearChange ${year}`);
      this.state.published_at = this.state.published_at.local().year(year).utc();
      this.setState(this.state);
    }
  }

  handleAddAuthor() {
    console.info("handleAddAuthor");
    this.state.authors.push(Object.assign({}, this.emptyAuthor));
    this.setState(this.state);
  }

  handleRemoveAuthor(index) {
    let author = this.state.authors[index];
    
    if (author.id === null)
      this.state.authors.splice(index, 1);
    else
      author._destroy = true;

    this.setState(this.state);
  }

  handleAuthorNameChange(author) {
    author.name = event.target.value;
    this.setState(this.state);
  }

  handleAddSubject(event) {
    let name = event.target.value.substring(0, event.target.value.length-1);

		if (name !== "") {
      event.target.value = "";
      let newSubject = Object.assign({}, this.emptySubject);
      newSubject.name = name;
      this.state.subjects.push(newSubject);
      this.setState(this.state);
		}
  }

  handleRemoveSubject(index) {
    console.info(`handleRemoveSubject ${index}`);
    let subject = this.state.subjects[index];
    
    if (subject.id === null)
      this.state.subjects.splice(index, 1);
    else
      subject._destroy = true;

    this.setState(this.state);
  }

  handleSubmission() {
    const method = this.state.id ? 'PATCH' : 'POST';
    const url = this.state.id ? `/api/v1/books/${this.state.id}`
                              : '/api/v1/books/create';

    console.info(`handleSubmission ${method} ${url}`);
    console.info(this.stateToJson());
    
    fetch(url, {
      method: method,
      headers: {
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
        "Content-Type": "application/json"
      },
      body: this.stateToJson()
    })
      .then(response => response.json())
      .then(json => {
        let state = this.jsonToState(json);
        console.info(state);
        this.props.onSubmission(state.id !== null ? true : false);

        if (state.id !== null)
          this.resetState();
        else {
          this.setState(state);
          throw new Error("Submitted form was not ok.");
        }
      })
      .catch(error => console.error(error));
  }
  
  componentDidMount() {
    this.form()
      .on("reset", () => setTimeout(() => this.resetState(), 1))
      .on("submit", event => { event.preventDefault(); this.handleSubmission(); });
  }
  
  render() {
    let authorsLength = this.state.authors.filter((value) => value._destroy === false).length
    let authors = this.state.authors.map((author, index) =>
      author._destroy === false &&
      <div className="input-group" key={index}>
        <input type="text"
               className={`form-author-input form-control ${authorsLength === 1 && "rounded-right"}`}
               defaultValue={author.name}
               onBlur={() => this.handleAuthorNameChange(author)}
               placeholder="Masukkan nama penulis"
               required />
        {
          authorsLength > 1 &&
          <div className="input-group-append">
            <button type="button" className="btn btn-danger rounded-right"
                    onClick={() => this.handleRemoveAuthor(index)}>Hapus</button>
          </div>
        }
        <div className="invalid-feedback">Tolong masukkan nama penulis yang benar.</div>
      </div>
    );

    let subjects = this.state.subjects.map((subject, index) =>
      subject._destroy === false &&
      <li className="border rounded bg-light d-flex justify-content-between align-items-center" key={index}>
        <span className="mr-2">{subject.name}</span>
        <span className="badge badge-danger"
              onClick={() => this.handleRemoveSubject(index)}>&times;</span>
      </li>
    );

    return (
      <form id={this.props.id} noValidate>
        <div className="form-group">
          <label htmlFor="form-title-input">Judul</label>
          <input type="text" className="form-control" id="form-title-input"
                 onBlur={event => this.handleTitleChange(event)}
                 placeholder="Masukkan judul" required />
          <div className="invalid-feedback">Tolong masukkan judul yang benar.</div>
        </div>
        <div className="form-group">
          <label htmlFor="form-publisher-input">Penerbit</label>
          <input type="text" className="form-control" id="form-publisher-input"
                 onBlur={event => this.handlePublisherNameChange(event)}
                 placeholder="Masukkan nama penerbit" required />
          <div className="invalid-feedback">Tolong masukkan nama penerbit yang benar.</div>
        </div>
        <div className="form-group">
          <label className="mb-1">Diterbitkan pada</label>
          <div className="form-row">
            <div className="form-group col-sm-3">
              <small className="text-muted mb-1">Tanggal</small>
              <input type="number" className="form-control" id="form-published-at-date-month-input"
                     onBlur={event => this.handlePublishedAtDateMonthChange(event)}
                     defaultValue={this.state.published_at.local().date()}
                     placeholder="..." required />
              <div className="invalid-feedback">Tolong masukkan hari yang benar.</div>
            </div>
            <div className="form-group col-sm-5">
              <small className="text-muted mb-1">Bulan</small>
              <select className="custom-select" id="form-published-at-month-input"
                      onChange={event => this.handlePublishedAtMonthChange(event)}
                      value={this.state.published_at.local().month()}>
                {moment.months().map((month, index) => (
                  <option value={index} key={index}>{month}</option>
                ))}
              </select>
              <div className="invalid-feedback">Tolong pilih bulan yang benar.</div>
            </div>
            <div className="form-group col-sm-4">
              <small className="text-muted mb-1">Tahun</small>
              <input type="number" className="form-control" id="form-published-at-year-input"
                     onBlur={event => this.handlePublishedAtYearChange(event)}
                     defaultValue={this.state.published_at.local().year()}
                     placeholder="..." required />
              <div className="invalid-feedback">Tolong masukkan tahun yang benar.</div>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <label>Penulis</label>
            <button type="button" className="btn btn-sm btn-outline-secondary"
                    onClick={() => this.handleAddAuthor()}>Tambah</button>
          </div>
          <div className="form-group" id="author-forms">{authors}</div>
        </div>
        <div className="form-group">
          <label>Subyek</label>
          <ul className="d-flex flex-wrap p-0 mb-0" id="subject-tags">{subjects}</ul>
          <input type="text" className="form-control"
                 onKeyUp={event => event.key === "," && this.handleAddSubject(event)}
                 placeholder="Tekan koma untuk menambah subyek" />
          <div className="invalid-feedback">Tolong masukkan subyek yang benar.</div>
        </div>
      </form>
    );
  }
}

export default BookForm;