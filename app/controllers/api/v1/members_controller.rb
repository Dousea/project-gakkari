class Api::V1::MembersController < ApplicationController
    def index
      members = Member.all # TODO: Filter .all
  
      render json: { members: members }
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
      member.username = member_params[:username]
      member.password = member_params[:password]
      member.password_confirmation = member_params[:password_confirmation]
      member.date_of_birth = Time.parse(member_params[:date_of_birth]).to_date
      member.phone_number = member_params[:phone_number].to_i
      member.address = member_params[:address]
    end
  
    def member_json(member)
      {
        id: member.id,
        username: member.username,
        date_of_birth: member.date_of_birth,
        phone_number: member.phone_number,
        address: member.address,
        errors: member.errors.to_hash
      }
    end
  
    def member_params
      params.require(:member)
            .permit(:id, :username, :password, :password_confirmation,
                    :date_of_birth, :phone_number, :address)
    end
  
    def member
      @member ||= Member.find(params[:id])
    end
end
