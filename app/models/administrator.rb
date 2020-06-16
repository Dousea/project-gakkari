class Administrator < ApplicationRecord
	validates_presence_of :user_information_id
	
	# The following validations are added automatically:
	# - Password must be present on creation
	# - Password length should be less than or equal to 72 bytes
	# - Confirmation of password (using a `password_confirmation` attribute)
	has_secure_password

	validates :username, presence: true, uniqueness: true
end
