class Api::V1::BooksController < ApplicationController
  def index
    books = Book.all.map do |book|
      {
        id: book.id,
        title: book.title,
        publisher: book.publisher.name
      }
    end

    render json: books
  end

  def create
    book = Book.new(book_params.except(:publisher))
    book.publisher = Publisher.where(name: book_params[:publisher]).first_or_create

    result = book.save

    render json: book_json(book), status: result ? 200 : 422
  end

  def update
    book.attributes = book_params
    result = book.save
    render json: book_json(book), status: result ? 200 : 422
  end

  def show
    render json: book_json(book), status: result ? 200 : 422
  end

  def destroy
    book.destroy
    render json: { result: :ok }
  end

  private

  def book_json(book)
    json = {
      id: book.id,
      title: (book.title.nil? ? '' : book.title),
      publisher: {
        id: book.publisher.id,
        name: (book.publisher.name.nil? ? '' : book.publisher.name),
        errors: book.publisher.errors.to_hash
      },
      published_at: book.published_at,
      errors: book.errors.to_hash,
      authors_attributes: book.authors.map do |author|
        {
          id: author.id,
          name: (author.name.nil? ? '' : author.name),
          errors: author.errors.to_hash,
          _destroy: author._destroy
        }
      end,
      subjects_attributes: book.subjects.map do |subject|
        {
          id: subject.id,
          name: (subject.name.nil? ? '' : subject.name),
          errors: subject.errors.to_hash,
          _destroy: subject._destroy
        }
      end
    }
  end

  def book_params
    params.require(:book)
          .permit(:id, :title, :publisher, :published_at, 
                  { authors_attributes: [:id, :name, :_destroy],
                    subjects_attributes: [:id, :name, :_destroy] })
  end

  def book
    @book ||= Book.find(params[:id])
  end
end
