import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"

import SessionAPI from "../helpers/session"

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