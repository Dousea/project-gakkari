import React from 'react'
import moment from 'moment'

import MemberAPI from '../helpers/member'

class Members extends React.Component {
  constructor(props) {
    super(props)

    moment.locale('id')

    this.state = {
      isLoading: false,
      activePage: 1,
      totalPages: 1,
      members: []
    }
  }

  handlePage(activePage) {
    this.setState({ isLoading: true })
    MemberAPI.getPage(activePage)
      .then(json => this.setState({
        isLoading: false,
        activePage: json.page,
        totalPages: json.pages,
        members: json.members
      }))
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

    let members = (
      <div className='d-flex justify-content-center mb-2'>
        <h4 className='text-center'>Tidak ada anggota yang tersedia.</h4>
      </div>
    )

    if (this.state.members.length > 0)
      members = (
        <table className='table bg-light'>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nama</th>
              <th scope="col">Alamat</th>
              <th scope="col">Tanggal Lahir</th>
              <th scope='col'>Nomor Telepon</th>
              <th scope='col'>Total Pinjaman Buku</th>
              <th scope='col'>Maks. Pinjaman Buku</th>
            </tr>
          </thead>
          <tbody>
            {this.state.members.map(member => (
              <tr key={member.id}>
                <th scope='row'>{member.id}</th>
                <td>{member.name}</td>
                <td>{member.address}</td>
                <td>{moment(member.date_of_birth).local().format('LL')}</td>
                <td>{member.phone_number}</td>
                <td>{member.total_books_borrowed}</td>
                <td>{member.max_borrowed_books}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    
    return (
      <>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <span className="h3 mb-0">Anggota</span>
          {this.state.totalPages > 1 && pagination}
          <button type='button' className='btn btn-primary' disabled>
            Daftarkan Anggota
          </button>
        </div>
        {
          this.state.isLoading
          ? <div className='my-5 d-flex justify-content-center'>
              <div className='spinner-border' role='status'>
                <span className='sr-only'>Loading...</span>
              </div>
            </div>
          : members
        }
      </>
    )
  }
}

export default Members