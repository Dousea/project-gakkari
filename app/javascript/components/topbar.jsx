import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBookOpen,
  faBook,
  faUsers,
  faUser,
  faBookmark
} from '@fortawesome/free-solid-svg-icons'

import SessionAPI from '../helpers/session'

class Topbar extends React.Component {
  handleLogout() {
    SessionAPI.destroy().then(() => this.props.handleLogout())
  }

  render() {
    return (
      <nav id='topbar' className='px-5 navbar navbar-expand-lg navbar-dark bg-gradient-primary'>
        <span className='navbar-brand mb-0 h1'>
          <FontAwesomeIcon icon={faBookOpen} className='mr-2' />
          <span className='d-none d-lg-inline'>Sistem Manajemen Perpustakaan</span>
        </span>
        
        <ul className='navbar-nav ml-auto'>
          <li className={`nav-item ${this.props.currentPage === 'books' && 'active'} text-center`}>
            <a className='nav-link' role='button' href='#' onClick={event => {this.props.handlePage('books'); event.preventDefault()}}>
              <FontAwesomeIcon icon={faBook} />
              <div className='small'>Buku</div>
            </a>
          </li>
  
          <li className={`nav-item ${this.props.currentPage === 'members' && 'active'} text-center`}>
            <a className='nav-link' role='button' href='#' onClick={event => {this.props.handlePage('members'); event.preventDefault()}}>
              <FontAwesomeIcon icon={faUsers} />
              <div className='small'>Anggota</div>
            </a>
          </li>
  
          <li className={`nav-item ${this.props.currentPage === 'transactions' && 'active'} text-center`}>
            <a className='nav-link' role='button' href='#' onClick={event => {this.props.handlePage('transactions'); event.preventDefault()}}>
              <FontAwesomeIcon icon={faBookmark} />
              <div className='small'>Pinjaman</div>
            </a>
          </li>
  
          <div className='navbar-divider'></div>
  
          <li className='nav-item dropdown no-arrow'>
            <a className='nav-link dropdown-toggle text-center' href='#' id='user-dropdown' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
              <FontAwesomeIcon icon={faUser} />
              <div className='small'>{this.props.admin.name}</div>
            </a>
            <div className='dropdown-menu dropdown-menu-right' aria-labelledby='user-dropdown'>
              <a className='dropdown-item disabled' href='#'>Profil</a>
              <a className='dropdown-item disabled' href='#'>Pengaturan</a>
              <div className='dropdown-divider'></div>
              <button type='button' className='dropdown-item' onClick={() => this.handleLogout()}>Keluar</button>
            </div>
          </li>
        </ul>
      </nav>
    )
  }
}

export default Topbar