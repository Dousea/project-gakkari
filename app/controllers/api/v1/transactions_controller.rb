class Api::V1::TransactionsController < ApplicationController
  def index
    params[:page] = 1 unless params.has_key? :page
    params[:entries] = 10 unless params.has_key? :entries
    transactions = Transaction.paginate(page: params[:page], per_page: params[:entries])

    render json: {
      transactions: transactions.order('date_of_issue DESC').map do |transaction|
        {
          id: transaction.id,
          member_id: transaction.member_id,
          book_id: transaction.book_id,
          date_of_issue: transaction.date_of_issue,
          due_date: transaction.due_date
        }
      end,
      page: transactions.current_page,
      pages: transactions.total_pages
    }
  end
end
