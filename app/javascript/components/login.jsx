import React, { useState, useEffect } from "react"

import SessionAPI from "../helpers/session"

class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      isUnauthorized: false
    }
  }

  handleSubmission() {
    this.setState({ isUnauthorized: false })
    SessionAPI.create(this.state.username, this.state.password)
      .then(success => {
        if (success)
          this.props.handleLogin()
        else
          this.setState({ isUnauthorized: true })
      })
  }

  render() {
    return (
      <div className="bg-gradient-primary w-100 h-100">
        <div className="container h-100">
          <div className="login-card card overflow-hidden border-0 shadow-lg">
            <div className="card-body p-0">
              <div className="row">
                <div className="col-lg-6 d-none d-lg-block login-bg-image"></div>
                <div className="col-lg-6">
                  <div className="p-5">
                    <div className="text-center">
                      <h1 className="h4 text-gray-900 mb-4">Selamat datang!</h1>
                    </div>
                    {
                      this.state.isUnauthorized
                      ? <div className="alert alert-danger" role="alert">
                          Harap masukkan nama pengguna dan kata sandi yang benar!
                        </div>
                      : <></>
                    }
                    <form className="user">
                      <label className="sr-only">Nama pengguna</label>
                      <input type="text"
                            className="form-control mb-2"
                            placeholder="Masukkan nama pengguna"
                            value={this.state.username}
                            onChange={event => this.setState({ username: event.target.value })}
                            required
                            autoFocus />
                      <label className="sr-only">Kata sandi</label>
                      <input type="password"
                            className="form-control mb-3"
                            placeholder="Masukkan kata sandi"
                            value={this.state.password}
                            onChange={event => this.setState({ password: event.target.value })}
                            required />
                      <button type="button"
                              onClick={() => this.handleSubmission()}
                              className="btn btn-primary btn-block" >Masuk</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login

/*
export default () => {
  const history = useHistory()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isUnauthorized, setIsUnauthorized] = useState(false)

  useEffect(() => {
    SessionAPI.getID()
      .then(id => {
        if (!isNaN(id))
          history.push("/dashboard")
      })
  }, [])
  
  const handleSubmission = () => {
    setIsUnauthorized(false)
    SessionAPI.create(username, password)
      .then(success => {
        if (success)
          history.push("/")
        else
          setIsUnauthorized(true)
      })
  }

  return (
    <div className="login-form vh-100 d-flex justify-content-center align-items-center">
      <form className="w-100 p-5">
        <div className="h3 mb-3 text-center">Masuk</div>
        {
          isUnauthorized
          ? <div className="alert alert-danger" role="alert">
              Harap masukkan nama pengguna dan kata sandi yang benar!
            </div>
          : <></>
        }
        <label className="sr-only">Nama pengguna</label>
        <input type="text"
               className="form-control mb-2"
               placeholder="Masukkan nama pengguna"
               value={username}
               onChange={event => setUsername(event.target.value)}
               required
               autoFocus />
        <label className="sr-only">Kata sandi</label>
        <input type="password"
               className="form-control mb-3"
               placeholder="Masukkan kata sandi"
               value={password}
               onChange={event => setPassword(event.target.value)}
               required />
        <button type="button"
                onClick={() => handleSubmission()}
                className="btn btn-primary btn-block" >Masuk</button>
      </form>
    </div>
  )
}
*/