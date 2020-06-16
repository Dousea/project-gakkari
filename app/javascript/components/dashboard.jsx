import React from 'react'

import SessionAPI from '../helpers/session'
import AdminAPI from '../helpers/admin'

import Topbar from './topbar'
import Login from './login'

import Books from './books'
import Members from './members'
import Transactions from './transactions'

function AlertToast() {
  return (
    <div id='alert-toast' className='toast hide' role='alert' data-delay='3000' aria-live='assertive' aria-atomic='true'>
      <div className='toast-header'>
        <strong id='alert-toast-text' className='mr-auto' />
        <button type='button' className='ml-2 mb-1 close' data-dismiss='toast' aria-label='Close'>
          <span aria-hidden='true'>&times;</span>
        </button>
      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className='h-100 d-flex align-items-center justify-content-center'>
      <div className='spinner-border' role='status'>
        <span className='sr-only'>Loading...</span>
      </div>
    </div>
  )
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      page: 'books',
      adminInfo: null,
      isAuthorizingAdmin: true,
      isAdminAuthorized: false
    }

    this.resetState = this.resetState.bind(this)
    this.handlePage = this.handlePage.bind(this)
  }

  resetState() {
    this.setState({
      adminInfo: null,
      isAuthorizingAdmin: true,
      isAdminAuthorized: false
    })
  }

  handlePage(page) {
    this.setState({ page: page })
  }

  setAdminInfo(id) {
    AdminAPI.getInfo(id)
      .then(info => this.setState({ adminInfo: info }))
  }

  authorizeAdmin() {
    if (this.state.isAuthorizingAdmin) {
      SessionAPI.getID()
        .then(id => {
          if (!isNaN(id)) this.setAdminInfo(id)
          this.setState({ isAuthorizingAdmin: false, isAdminAuthorized: !isNaN(id) })
        })
    }
  }

  render() {
    this.authorizeAdmin()

    let isAuthorizedAndLoaded = this.state.isAdminAuthorized && this.state.adminInfo !== null
    let isAuthorizedAndLoading = this.state.isAdminAuthorized && this.state.adminInfo === null
    let isLoading = this.state.isAuthorizingAdmin || isAuthorizedAndLoading

    if (isAuthorizedAndLoaded) {
      let content = <></>

      switch (this.state.page) {
        case 'books': content = <Books />; break;
        case 'members': content = <Members />; break;
        case 'transactions': content = <Transactions />; break;
      }

      return (
        <>
          <AlertToast />
          <Topbar admin={this.state.adminInfo}
                  currentPage={this.state.page}
                  handlePage={this.handlePage}
                  handleLogout={this.resetState} />
          <div id='content' className='container-fluid px-5'>
            {content}
          </div>
        </>
      )
    } else if (isLoading) {
      return <LoadingSpinner />
    } else {
      return <Login handleLogin={this.resetState} />
    }
  }
}

export default Dashboard