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

    this.state = this.originalState();
  }

  form() {
    return $(`#${this.props.id}`);
  }

  originalState() {
    return {
      id: null,
      title: '',
      publisher: {
        id: null,
        name: '',
        errors: {}
      },
      publishedAt: moment.utc(),
      errors: {},
      authors: [Object.assign({}, this.emptyAuthor)],
      subjects: []
    };
  }

  stateToJson() {
    const book = this.state;
    return JSON.stringify({
      book: {
        id: book.id,
        title: book.title,
        publisher: book.publisher.name,
        published_at: book.publishedAt.toISOString(),
        authors_attributes: book.authors.map(author => ({
          id: author.id,
          name: author.name,
          _destroy: author._destroy
        })),
        // If the `id` is null and needs to be destroyed then it is still a new
        // record and doesn't need to be passed to controller
        subjects_attributes: book.subjects.filter(subject => !(subject.id === null && subject._destroy === true))
          .map(subject => ({ id: subject.id, name: subject.name, _destroy: subject._destroy }))
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
    state.publishedAt = moment.utc(state.published_at);
    delete state.published_at;

    return state;
  }

  handleTitleChange(event) {
    this.setState({ title: event.target.value });
  }

  handlePublisherNameChange(event) {
    const name = event.target.value;
    this.setState(prevState => ({
      publisher: {
        ...prevState.publisher,
        name: name
      }
    }));
  }

  handlePublishedAtDateMonthChange(event) {
    let dateMonthInput = $(event.target);
    const currentDaysInMonth = this.state.publishedAt.local().daysInMonth();

    if (/^\d+$/.test(dateMonthInput.val()) === false || dateMonthInput.val() < 1)
      dateMonthInput.val(1);
    else if (dateMonthInput.val() > currentDaysInMonth)
      dateMonthInput.val(currentDaysInMonth);
    else {
      let dateMonth = dateMonthInput.val();
      console.info(`handlePublishedAtDateMonthChange ${dateMonth}`);
      this.setState(prevState => ({ publishedAt: prevState.publishedAt.local().date(dateMonth).utc() }));
    }
  }

  handlePublishedAtMonthChange(event) {
    let month = $(event.target).find("option:selected").val();
    console.info(`handlePublishedAtMonthChange ${month}`);
    this.setState(prevState => ({ publishedAt: prevState.publishedAt.local().month(month).utc() }));
  }

  handlePublishedAtYearChange(event) {
    let yearInput = $(event.target);
    const currentYear = moment().year();

    if (/^\d+$/.test(yearInput.val()) === false || yearInput.val() < 0)
      yearInput.val(0);
    else if (yearInput.val() > currentYear)
      yearInput.val(currentYear);
    else {
      let year = yearInput.val();
      console.info(`handlePublishedAtYearChange ${year}`);
      this.setState(prevState => ({ publishedAt: prevState.publishedAt.local().year(year).utc() }));
    }
  }

  handleAddAuthor() {
    console.info("handleAddAuthor");
    this.setState(prevState => ({ authors: [...prevState.authors, Object.assign({}, this.emptyAuthor)] }));
  }

  handleRemoveAuthor(index) {
    if (this.state.authors[index].id === null)
      this.setState(prevState => ({ authors: prevState.authors.filter((_, i) => i !== index) }));
    else {
      this.setState(prevState => {
        const authors = [...prevState.authors];
        authors[index]._destroy = true;
        return { authors: authors };
      });
    }
  }

  handleAuthorNameChange(event, index) {
    const name = event.target.value;
    this.setState(prevState => {
      const authors = [...prevState.authors];
      authors[index].name = name;
      return { authors: authors };
    });
  }

  handleAddSubject(event) {
    const name = event.target.value;
    this.setState(prevState => ({
      subjects: [
        ...prevState.subjects,
        Object.assign({}, this.emptySubject, { name: name })
      ]
    }));

    event.target.value = "";
  }

  handleRemoveSubject(index) {
    console.info(`handleRemoveSubject ${index}`);

    if (this.state.subjects[index].id === null)
      this.setState(prevState => ({ subjects: prevState.subjects.filter((_, i) => i !== index) }));
    else {
      this.setState(prevState => {
        const subjects = [...prevState.subjects];
        subjects[index]._destroy = true;
        return { subjects: subjects };
      });
    }
  }

  handleErrors() {
    const error = this.state.errors;
    let invalidInputs = [];

    if (error["title"])
      invalidInputs.push($("#form-title-input"));
    
    if (Object.keys(this.state.publisher.errors).length > 0)
      invalidInputs.push($("#form-publisher-input"));
    
    if (error["published_at"])
      invalidInputs.push($("input[id^=form-published-at]"));
    
    if (error["authors"])
      invalidInputs.push($(".form-authors-input"));
    
    if (error["subjects"])
      invalidInputs.push($("#form-subjects-input"));
    
    this.state.authors.forEach((author, index) => {
      if (Object.keys(author.errors).length > 0)
        invalidInputs.push($(`.form-author-input[data-index="${index}"]`));
    });

    invalidInputs.forEach(input => input.addClass("is-invalid"));
  }

  handleSubmission() {
    const method = this.state.id ? 'PATCH' : 'POST';
    const url = this.state.id ? `/api/v1/books/${this.state.id}`
                              : '/api/v1/books/create';

    console.info(`handleSubmission ${method} ${url}`);
    
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
          this.setState(this.originalState());
        else {
          this.setState(state);
          this.handleErrors();
          throw new Error("Submitted form was not ok.");
        }
      })
      .catch(error => console.error(error));
  }
  
  componentDidMount() {
    // Removes 'is-invalid' class from elements on focus-in
    this.form().find("input").on("focusin", event => $(event.target).removeClass("is-invalid"));

    this.form()
      .on("reset", () => setTimeout(() => this.setState(this.originalState()), 1))
      .on("submit", event => { event.preventDefault(); this.handleSubmission(); });
  }
  
  render() {
    let authorsLength = this.state.authors.filter((value) => value._destroy === false).length
    let authors = this.state.authors.map((author, index) =>
      author._destroy === false &&
      <div className="input-group" key={index}>
        <input type="text"
               className="form-author-input form-control"
               value={author.name}
               onChange={event => this.handleAuthorNameChange(event, index)}
               data-index={index}
               placeholder="Masukkan nama penulis"
               required />
        <div className="input-group-append">
          <button type="button"
                  onClick={() => index < authorsLength-1 ? this.handleRemoveAuthor(index) : this.handleAddAuthor()}
                  className={`btn btn-${index < authorsLength-1 ? "danger" : "secondary"} rounded-right`}>
            {index < authorsLength-1 ? "Hapus" : "Tambah"}
          </button>
        </div>
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
                 onChange={event => this.handleTitleChange(event)}
                 value={this.state.title}
                 placeholder="Masukkan judul" required />
          <div className="invalid-feedback">Tolong masukkan judul yang benar.</div>
        </div>
        <div className="form-group">
          <label htmlFor="form-publisher-input">Penerbit</label>
          <input type="text" className="form-control" id="form-publisher-input"
                 onChange={event => this.handlePublisherNameChange(event)}
                 value={this.state.publisher.name}
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
                     defaultValue={this.state.publishedAt.local().date()}
                     placeholder="..." required />
              <div className="invalid-feedback">Tolong masukkan hari yang benar.</div>
            </div>
            <div className="form-group col-sm-5">
              <small className="text-muted mb-1">Bulan</small>
              <select className="custom-select" id="form-published-at-month-input"
                      onChange={event => this.handlePublishedAtMonthChange(event)}
                      value={this.state.publishedAt.local().month()}>
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
                     defaultValue={this.state.publishedAt.local().year()}
                     placeholder="..." required />
              <div className="invalid-feedback">Tolong masukkan tahun yang benar.</div>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>Penulis</label>
          <div className="form-group" id="author-forms">{authors}</div>
        </div>
        <div className="form-group">
          <label>Subyek</label>
          <ul className="subject-tags d-flex flex-wrap p-0 mb-0">{subjects}</ul>
          <input type="text" className="form-control" id="form-subjects-input"
                 onKeyUp={event => event.key === "Enter" && this.handleAddSubject(event)}
                 defaultValue=""
                 placeholder='Tekan "Enter" untuk menambah subyek' />
          <div className="invalid-feedback">Tolong masukkan subyek yang benar.</div>
        </div>
      </form>
    );
  }
}

export default BookForm;