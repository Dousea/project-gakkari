import React from 'react'
import moment from 'moment'

import TransactionAPI from '../helpers/transaction'
import MemberAPI from '../helpers/member'
import BookAPI from '../helpers/book'

class Transaction extends React.Component {
  constructor(props) {
    super(props)

    moment.locale('id')

    this.state = {
      memberName: null,
      bookTitle: null,
      dateOfIssue: moment(this.props.dateofIssue),
      dueDate: moment(this.props.dueDate)
    }
  }

  isLoading() {
    return this.state.memberName === null ||
           this.state.bookTitle === null
  }

  componentDidMount() {
    MemberAPI.getInfo(this.props.memberId)
      .then(json => this.setState({ memberName: json.name }))
    BookAPI.getInfo(this.props.bookId)
      .then(json => this.setState({ bookTitle: json.title }))
  }

  render() {
    return (
      <div className='col-12'>
        <div className='card mb-4 shadow-sm border-left-success'>
          <div className='card-body'>
            {
            this.isLoading()
            ? <div className='d-flex justify-content-center'>
                <div className='spinner-border' role='status'>
                  <span className='sr-only'>Loading...</span>
                </div>
              </div>
            : <>
                <strong>{this.state.memberName}</strong> meminjam buku <strong>{this.state.bookTitle}</strong>
                <br />
                <small className="text-muted">
                  Dipinjam {this.state.dateOfIssue.local().fromNow()}, harus dikembalikan {moment().local().to(this.state.dueDate.local())}
                </small>
              </>
            }
          </div>
        </div>
      </div>
    )
  }
}

class TransactionList extends React.Component {
  constructor(props) {
    super(props)

    moment.locale('id')

    this.state = {
      isLoading: false,
      activePage: 1,
      totalPages: 1,
      transactions: []
    }
  }

  handlePage(activePage) {
    this.setState({ isLoading: true })
    TransactionAPI.getPage(activePage)
      .then(json => {
        this.setState({
          isLoading: false,
          activePage: json.page,
          totalPages: json.pages,
          transactions: json.transactions
        })
      })
  }

  componentDidMount() {
    this.handlePage(this.state.activePage)
  }

  render() {
    let paginationOptions = []

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

    let transactions = (
      <div className='d-flex justify-content-center mb-2'>
        <h4 className='text-center'>Tidak ada pinjaman yang tersedia.</h4>
      </div>
    )

    if (this.state.transactions.length > 0)
      transactions = (
        <div className="row mt-2">
          {this.state.transactions.map(transaction => 
            <Transaction key={transaction.id}
                         memberId={transaction.member_id}
                         bookId={transaction.book_id}
                         dateOfIssue={transaction.date_of_issue}
                         dueDate={transaction.due_date} />
          )}
        </div>
      )
    
    return (
      <>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <span className="h3 mb-0">Pinjaman</span>
          {this.state.totalPages > 1 && pagination}
          <button type='button' className='btn btn-primary' disabled>
            Buat Pinjaman
          </button>
        </div>
        {
          this.state.isLoading
          ? <div className='my-5 d-flex justify-content-center'>
              <div className='spinner-border' role='status'>
                <span className='sr-only'>Loading...</span>
              </div>
            </div>
          : transactions
        }
      </>
    )
  }
}

export default TransactionList