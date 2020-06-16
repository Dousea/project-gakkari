class Transaction < ApplicationRecord
  validates :member_id, :book_id, :date_of_issue, :due_date, presence: true
  validate :date_of_issue_is_valid_date
  validate :due_date_is_valid_date
  validate :member_borrowed_books_are_less


  private

  def date_of_issue_is_valid_date
    Date.parse(date_of_issue.to_s) rescue errors.add(:date_of_issue, 'must be a valid date')
  end

  def due_date_is_valid_date
    Date.parse(due_date.to_s) rescue errors.add(:due_date, 'must be a valid date')
  end

  def member_borrowed_books_are_less
    member = Member.find(member_id)
    if member.total_books_borrowed > member.max_borrowed_books
      errors.add(:member_id, "borrowed books must be less than #{member.max_borrowed_books} (are #{member.total_books_borrowed})")
    end
  end
end
