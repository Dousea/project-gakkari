class CreateUserInformations < ActiveRecord::Migration[6.0]
  def change
    create_table :user_informations do |t|
      t.string :name
      t.string :address
      t.date :date_of_birth
      t.string :phone_number
      t.timestamps
    end
  end
end
