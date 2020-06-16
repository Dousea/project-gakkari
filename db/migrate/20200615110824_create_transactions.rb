class CreateTransactions < ActiveRecord::Migration[6.0]
  def change
    create_table :transactions do |t|
      t.belongs_to :member
      t.belongs_to :book
      t.date :date_of_issue
      t.date :due_date
      t.timestamps
    end
  end
end
