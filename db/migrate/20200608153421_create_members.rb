class CreateMembers < ActiveRecord::Migration[6.0]
  def change
    create_table :members do |t|
      t.string :username
      t.string :password_digest
      t.string :name
      t.string :address
      t.date :date_of_birth
      t.string :phone_number
      t.timestamps
    end
  end
end
