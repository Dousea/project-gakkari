class Book < ApplicationRecord
  belongs_to :publisher
  has_and_belongs_to_many :authors
  has_and_belongs_to_many :subjects
  validates :title, presence: true
  validate :published_at_is_valid_date
  validate :must_have_authors
  validate :must_have_subjects
  accepts_nested_attributes_for :authors, allow_destroy: true
  accepts_nested_attributes_for :subjects, allow_destroy: true

  private

  def published_at_is_valid_date
    Date.parse(published_at.to_s) rescue errors.add(:published_at, 'must be a valid date')
  end

  def must_have_authors
    errors.add(:authors, 'must have at least one author') if authors.all?(&:marked_for_destruction?)
  end

  def must_have_subjects
    errors.add(:subjects, 'must have at least one subject') if subjects.all?(&:marked_for_destruction?)
  end
end
