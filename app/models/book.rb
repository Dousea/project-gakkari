class Book < ApplicationRecord
  validates :title, presence: true
  belongs_to :publisher
  has_and_belongs_to_many :authors
  has_and_belongs_to_many :subjects
  accepts_nested_attributes_for :authors, allow_destroy: true
  accepts_nested_attributes_for :subjects, allow_destroy: true
end
