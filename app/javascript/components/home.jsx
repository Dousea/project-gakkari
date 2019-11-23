import React from "react";
import { Link } from "react-router-dom";

export default () => (
  <div className="vw-100 vh-100 d-flex align-items-center justify-content-center bg-light">
    <div className="jumbotron bg-transparent text-center">
      <h1 className="display-4">Perpustakaan Gakkari</h1>
      <p className="lead">Ayo cek persediaan buku dalam Perpustakaan Gakkari!</p>
      <hr className="my-4" />
      <Link to="/books" className="btn btn-lg btn-primary" role="button">Masuk</Link>
    </div>
  </div>
);