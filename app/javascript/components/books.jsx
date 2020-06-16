import React from 'react'
import moment from 'moment'
import $ from 'jquery'

import BookForm from './book-form'
import BookAPI from '../helpers/book'

import '../stylesheets/pagination.scss'
import '../stylesheets/books.scss'

class Books extends React.Component {
  constructor(props) {
    super(props)

    moment.locale('id')

    this.state = {
      isLoading: false,
      activePage: 1,
      totalPages: 1,
      books: []
    }
  }

  handleDeleteBook(bookId) {
    BookAPI.destroy(bookId)
      .then(success => {
        let alertMessage
        
        if (success) {
          alertMessage = 'Buku telah berhasil dihapus.'
          
          this.handlePage(1)
        } else
          alertMessage = 'Buku telah gagal dihapus.'

        $('#alert-toast #alert-toast-text').text(alertMessage)
        $('#alert-toast').toast('show')
      })
  }

  handlePage(activePage) {
    this.setState({ isLoading: true })
    BookAPI.getPage(activePage)
      .then(json => this.setState({
        isLoading: false,
        activePage: json.page,
        totalPages: json.pages,
        books: json.books
      }))
  }

  componentDidMount() {
    this.handlePage(this.state.activePage)
  }

  render() {
    let paginationOptions = [];

    for (let page = 1; page <= this.state.totalPages; page++) {
      paginationOptions.push(<option key={page} value={page}>{page}</option>)
    }

    let pagination = (
      <nav>
        <div className='input-group'>
          <div className='input-group-prepend'>
            <button className='btn btn-secondary' type='button'>Kembali</button>
          </div>
          <select className='custom-select' value={this.state.activePage}
                  onChange={event => this.handlePage(parseInt(event.target.value))}>
            {paginationOptions}
          </select>
          <div className='input-group-append'>
            <button className='btn btn-secondary' type='button'>Lanjut</button>
          </div>
        </div>
      </nav>  
    )

    let books = (
      <>
        <div className='d-flex justify-content-center mb-2'>
          <h4 className='text-center'>Tidak ada buku yang tersedia.</h4>
        </div>
      </>
    )

    if (this.state.books.length > 0)
      books = (
        <div className='row mt-2'>
          {this.state.books.map(book => (
            <div key={book.id} className='col-lg-4'>
              <div className='card mb-4 shadow-sm'>
                <h5 className='card-header'>{book.title}</h5>
                <ul className='list-group list-group-flush'>
                  <li className='list-group-item'>
                    <small className='d-block text-muted'>Dipublikasikan oleh</small>
                    {book.publisher}
                  </li>
                  <li className='list-group-item'>
                    <small className='d-block text-muted'>Dipublikasikan pada</small>
                    {moment(book.published_at).local().format('LL')}
                  </li>
                  <li className='list-group-item'>
                    <small className='d-block text-muted'>Ditulis oleh</small>
                    {
                      book.authors.length > 1
                      ? <ul id='authors-list'>
                          {book.authors.map((author, index) => <li key={index}>{author}</li>)}
                        </ul>
                      : book.authors[0]
                    }
                  </li>
                  <li className='list-group-item'>
                    <small className='d-block text-muted'>Subyek</small>
                    <ul className='subject-tags d-flex flex-wrap p-0 mb-0'>
                      {book.subjects.map((subject, index) =>
                        <li className='border rounded bg-light d-flex align-items-center' key={index}>
                          {subject}
                        </li>
                      )}
                    </ul>
                  </li>
                </ul>
                <div className='card-footer d-flex justify-content-between'>
                  <small className='d-none d-sm-block text-muted'>Diperbaharui<br/>{moment(book.updated_at).fromNow()}</small>
                  <div className='btn-group'>
                    <button type='button' className='btn btn-outline-secondary' data-toggle='modal' data-target='#book-form-modal' data-id={book.id}>Sunting</button>
                    <button type='button' className='btn btn-outline-danger' onClick={() => this.handleDeleteBook(book.id)}>Hapus</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    
    return (
      <>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <span className="h3 mb-0">Buku</span>
          {this.state.totalPages > 1 && pagination}
          <button type='button' className='btn btn-primary' data-toggle='modal' data-target='#book-form-modal'>
            Masukkan Buku
          </button>
        </div>
        {
          this.state.isLoading
          ? <div className='my-5 d-flex justify-content-center'>
              <div className='spinner-border' role='status'>
                <span className='sr-only'>Loading...</span>
              </div>
            </div>
          : books
        }
        <BookForm />
      </>
    )
  }
}

export default Books