import React from 'react'
import { withRouter } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBookOpen,
  faBook,
  faUsers,
  faUser
} from '@fortawesome/free-solid-svg-icons'

import SessionAPI from '../helpers/session'

class Topbar extends React.Component {
  handleLogout() {
    SessionAPI.destroy().then(() => this.props.history.push('/login'))
  }

  render() {
    return (
      <nav id='topbar' className='navbar navbar-expand-lg navbar-light bg-light'>
        <span className='navbar-brand mb-0 h1'>
          <FontAwesomeIcon icon={faBookOpen} className='mr-2' />
          <span className='d-none d-lg-inline'>Sistem Manajemen Perpustakaan</span>
        </span>
        
        <ul className='navbar-nav ml-auto'>
          <li className='nav-item text-center'>
            <a className='nav-link' href='#'>
              <FontAwesomeIcon icon={faBook} />
              <div className='small'>Buku</div>
            </a>
          </li>
  
          <li className='nav-item text-center'>
            <a className='nav-link' href='#'>
              <FontAwesomeIcon icon={faUsers} />
              <div className='small'>Anggota</div>
            </a>
          </li>
  
          <div className='navbar-divider'></div>
  
          <li className='nav-item dropdown no-arrow'>
            <a className='nav-link dropdown-toggle text-center' href='#' id='user-dropdown' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
              <FontAwesomeIcon icon={faUser} />
              <div className='small'>{this.props.member.username}</div>
            </a>
            <div className='dropdown-menu dropdown-menu-right' aria-labelledby='user-dropdown'>
              <a className='dropdown-item' href='#'>Action</a>
              <a className='dropdown-item' href='#'></a>
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