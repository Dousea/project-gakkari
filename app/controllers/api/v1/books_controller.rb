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
    book = Book.new
    book_update_attribs_from_params(book)
    result = book.save

    render json: book_json(book), status: result ? 200 : 422
  end

  def update
    book_update_attribs_from_params(book)
    result = book.save

    render json: book_json(book), status: result ? 200 : 422
  end

  def edit
    render json: book_json(book)
  end

  def show
    render json: book_json(book)
  end

  def destroy
    book.destroy
    render json: { result: :ok }
  end

  private

  def book_update_attribs_from_params(book)
    # book_params passed :id symbols to the models but here we are creating
    # new record, so we don't need them
    book.title = book_params[:title]
    book.published_at = Time.parse(book_params[:published_at]).to_date
    book.publisher = Publisher.where(name: book_params[:publisher]).first_or_create

    book_params[:authors_attributes].map do |author|
      if author[:_destroy] && !author[:id].nil?
        book.authors.delete(Author.find(author[:id]))
      elsif !book.authors.exists?(name: author[:name])
        author_record = Author.where(name: author[:name]).first

        if !!author_record
          book.authors << author_record
        else
          book.authors.build(name: author[:name])
        end
      end
    end

    book_params[:subjects_attributes].map do |subject|
      if subject[:_destroy] && !subject[:id].nil?
        book.subjects.delete(Subject.find(subject[:id]))
      elsif !book.subjects.exists?(name: subject[:name])
        subject_record = Subject.where(name: subject[:name]).first

        if !!subject_record
          book.subjects << subject_record
        else
          book.subjects.build(name: subject[:name])
        end
      end
    end
  end

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
