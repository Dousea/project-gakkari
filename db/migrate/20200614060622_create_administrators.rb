class CreateAdministrators < ActiveRecord::Migration[6.0]
  def change
    create_table :administrators do |t|
      t.belongs_to :user_information, index: { unique: true }, foreign_key: true
      t.string :username
      t.string :password_digest
      t.timestamps
    end
  end
end
