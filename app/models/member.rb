class Member < ApplicationRecord
  validates_presence_of :user_information_id

  def total_books_borrowed
    Transaction.where(member_id: id).count
  end
end
