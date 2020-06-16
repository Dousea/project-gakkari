require 'csv'

=begin
csv_text = File.read(Rails.root.join('lib', 'seeds', 'books_mock_data.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  book = Book.new
  book.title = row['title']
  book.published_at = Time.parse(row['published_at']).to_date
  book.publisher = Publisher.where(name: row['publisher']).first_or_create

  if !book.authors.exists?(name: row['author'])
    author_record = Author.where(name: row['author']).first

    if !!author_record
      book.authors << author_record
    else
      book.authors.build(name: row['author'])
    end
  end

  row['subjects'].split('|') do |subject|
    if !book.subjects.exists?(name: subject)
      subject_record = Subject.where(name: subject).first

      if !!subject_record
        book.subjects << subject_record
      else
        book.subjects.build(name: subject)
      end
    end
  end
  
  if book.save
    puts "#{book.title} saved"
  else
    puts "Error saving #{book.title}"
  end
end
=end

puts "There are now #{Book.count} rows in the `books` table"

=begin
csv_text = File.read(Rails.root.join('lib', 'seeds', 'members_mock_data.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  info = UserInformation.new
  info.name = row['name']
  info.address = row['address']
  info.date_of_birth = Time.parse(row['date_of_birth']).to_date
  info.phone_number = row['phone_number']

  saved = false
  
  if info.save
    member = Member.new
    member.user_information_id = info.id
    
    if member.save
      saved = true
    else
      saved = false
    end
  else
    saved = false
  end
  
  if saved
    puts "#{info.name} saved"
  else
    puts "Error saving #{row['name']}"
  end
end
=end

puts "There are now #{Member.count} rows in the `members` table"

=begin
csv_text = File.read(Rails.root.join('lib', 'seeds', 'transactions_mock_data.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  transaction = Transaction.new
  transaction.member_id = row['member_id'] if Member.find(row['member_id'])
  transaction.book_id = row['book_id'] if Book.find(row['book_id'])
  transaction.date_of_issue = Time.parse(row['date_of_issue']).to_date
  transaction.due_date = Time.parse(row['due_date']).to_date

  if !transaction.save
    puts "Error saving ##{row['id']}"
  end
end
=end

puts "There are now #{Transaction.count} rows in the `transactions` table"