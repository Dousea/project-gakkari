import React from 'react'

import SessionAPI from '../helpers/session'
import MemberAPI from '../helpers/member'

import Topbar from './topbar'
import Login from './login'
import Books from './books'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      page: 'books',
      memberInfo: null,
      isAuthorizingMember: true,
      isMemberAuthorized: false
    }
  }

  handlePage(page) {
    this.setState({ page: page })
  }

  setMemberInfo(id) {
    MemberAPI.getInfo(id)
      .then(info => this.setState({ memberInfo: info }))
  }

  componentDidMount() {
    SessionAPI.getID()
      .then(id => {
        if (!isNaN(id)) this.setMemberInfo(id)
        this.setState({ isAuthorizingMember: false, isMemberAuthorized: !isNaN(id) })
      })
  }

  render() {
    let isAuthorizedAndLoaded = this.state.isMemberAuthorized && this.state.memberInfo !== null
    let isAuthorizedAndLoading = this.state.isMemberAuthorized && this.state.memberInfo === null
    let isLoading = this.state.isAuthorizingMember || isAuthorizedAndLoading

    console.log(this.state)

    if (isAuthorizedAndLoaded) {
      let content = <></>

      switch (this.state.page) {
        case 'books': content = <Books />; break;
      }

      return (
        <>
          <Topbar member={this.state.memberInfo} handlePage={this.handlePage} />
          <div id='content' aria-live='polite' aria-atomic='true' className='position-relative'>
            <div id='alert-toast' className='toast' role='alert' data-delay='3000' aria-live='assertive' aria-atomic='true'>
              <div className='toast-header'>
                <strong id='alert-toast-text' className='mr-auto' />
                <button type='button' className='ml-2 mb-1 close' data-dismiss='toast' aria-label='Close'>
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
            </div>
            {content}
          </div>
        </>
      )
    } else if (isLoading) {
      return (
        <div className='h-100 d-flex align-items-center justify-content-center'>
          <div className='spinner-border' role='status'>
            <span className='sr-only'>Loading...</span>
          </div>
        </div>
      )
    } else {
      return <Login />
    }
  }
}

export default Dashboard