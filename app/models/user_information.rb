class UserInformation < ApplicationRecord
  validates_presence_of :name
  validate :date_of_birth_is_valid_date

  private

  def date_of_birth_is_valid_date
    if date_of_birth.present?
      Date.parse(date_of_birth.to_s) rescue errors.add(:date_of_birth, 'must be a valid date')
    end
  end
end
