class Api::V1::AdministratorsController < ApplicationController
  def create    
    administrator = Administrator.new
    administrator_update_attribs_from_params(administrator)
    result = administrator.save

    render json: administrator_json(administrator), status: (result ? :ok : :unprocessable_entity)
  end

  def update
    administrator_update_attribs_from_params(administrator)
    result = administrator.save

    render json: administrator_json(administrator), status: (result ? :ok : :unprocessable_entity)
  end

  def show
    render json: administrator_json(administrator)
  end

  def destroy
    administrator.destroy
    head :no_content
  end

  private

  def administrator_update_attribs_from_params(administrator)
    administrator.username = administrator_params[:username]
    administrator.password = administrator_params[:password]
    administrator.password_confirmation = administrator_params[:password_confirmation]

    user_information = UserInformation.find(administrator.user_information_id) || UserInformation.new
    user_information.name = administrator_params[:name]
    user_information.date_of_birth = Time.parse(administrator_params[:date_of_birth]).to_date
    user_information.phone_number = administrator_params[:phone_number].to_i
    user_information.address = administrator_params[:address]

    if user_information.new_record?
      if user_information.save
        administrator.user_information_id = user_information.id
      end
    end

    @errors = administrator.errors.to_hash
    @errors[:user_information] = user_information.errors.to_hash
  end

  def administrator_json(administrator)
    puts administrator.inspect
    user_information = UserInformation.find(administrator.user_information_id)

    {
      id: administrator.id,
      username: administrator.username,
      name: user_information.name,
      date_of_birth: user_information.date_of_birth,
      phone_number: user_information.phone_number,
      address: user_information.address,
      errors: @errors
    }
  end

  def administrator_params
    params.require(:administrator)
          .permit(:id, :username, :password, :password_confirmation,
                  :name, :date_of_birth, :phone_number, :address)
  end

  def administrator
    @administrator ||= Administrator.find(params[:id])
  end
end
