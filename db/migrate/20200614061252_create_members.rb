class CreateMembers < ActiveRecord::Migration[6.0]
  def change
    create_table :members do |t|
      t.belongs_to :user_information, index: { unique: true }, foreign_key: true
      t.integer :total_books_borrowed
      t.integer :max_borrowed_books, default: 5
      t.timestamps
    end
  end
end
