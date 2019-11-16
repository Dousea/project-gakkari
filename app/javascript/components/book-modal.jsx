import React from "react";
import $ from "jquery";

import BookForm from "./book-form";

class BookModal extends React.Component {
  constructor(props) {
    super(props);
  }

  onSave() {
    let form = $("#book-form");

    if (form[0].checkValidity() === true) {
      // Let's handle the submission
      form.trigger("submit");
      // and then dismiss the modal
      $("#modal-save-btn").attr("data-dismiss", "modal");
    }

    form.addClass("was-validated");
  }

  onClose() {
    $("#book-form")
      .trigger("reset")
      .removeClass("was-validated");
  }
  
  componentDidMount() {
    $("#modal-close-btn").on("click", () => this.onClose());
    $("#modal-save-btn").on("click", () => this.onSave())
  }

  render() {
    return (
      <div className="modal fade" id={this.props.id} tabIndex="-1" role="dialog" data-keyboard="false" data-backdrop="static" aria-labelledby={this.props.id} aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Formulir Buku</h5>
            </div>
            <div className="modal-body">
              <BookForm id="book-form" />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" id="modal-close-btn" data-dismiss="modal">Tutup</button>
              <button type="button" className="btn btn-primary" id="modal-save-btn">Simpan</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BookModal;