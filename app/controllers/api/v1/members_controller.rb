class Api::V1::MembersController < ApplicationController
  def index
    params[:page] = 1 unless params.has_key? :page
    params[:entries] = 10 unless params.has_key? :entries
    members = Member.paginate(page: params[:page], per_page: params[:entries])

    render json: {
      members: members.order('updated_at DESC').map do |member|
        user_information = UserInformation.find(member.user_information_id)

        {
          id: member.id,
          name: user_information.name,
          address: user_information.address,
          date_of_birth: user_information.date_of_birth,
          phone_number: user_information.phone_number,
          total_books_borrowed: member.total_books_borrowed,
          max_borrowed_books: member.max_borrowed_books,
          updated_at: member.updated_at
        }
      end,
      page: members.current_page,
      pages: members.total_pages
    }
  end

  def create    
    member = Member.new
    member_update_attribs_from_params(member)
    result = member.save

    render json: member_json(member), status: (result ? :ok : :unprocessable_entity)
  end

  def update
    member_update_attribs_from_params(member)
    result = member.save

    render json: member_json(member), status: (result ? :ok : :unprocessable_entity)
  end

  def show
    render json: member_json(member)
  end

  def destroy
    member.destroy
    head :no_content
  end

  private

  def member_update_attribs_from_params(member)
    member.total_books_borrowed = member_params[:total_books_borrowed]
    member.max_borrowed_books = member_params[:max_borrowed_books]

    user_information = UserInformation.find(member.user_information_id) || UserInformation.new
    user_information.name = member_params[:name]
    user_information.date_of_birth = Time.parse(member_params[:date_of_birth]).to_date
    user_information.phone_number = member_params[:phone_number].to_i
    user_information.address = member_params[:address]

    if user_information.new_record?
      if user_information.save
        member.user_information_id = user_information.id
      end
    end

    @errors = member.errors.to_hash
    @errors[:user_information] = user_information.errors.to_hash
  end

  def member_json(member)
    user_information = UserInformation.find(member.user_information_id)

    {
      id: member.id,
      name: user_information.name,
      date_of_birth: user_information.date_of_birth,
      phone_number: user_information.phone_number,
      address: user_information.address,
      errors: @errors
    }
  end

  def member_params
    params.require(:member)
          .permit(:id, :total_books_borrowed, :max_borrowed_books,
                  :name, :date_of_birth, :phone_number, :address)
  end

  def member
    @member ||= Member.find(params[:id])
  end
end
