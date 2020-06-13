class Api::V1::SessionsController < ApplicationController
  def create
    member = Member.find_by(username: params[:session][:username])

    if member && member.authenticate(params[:session][:password])
      session[:member_id] = member.id.to_s
      head :ok
    else
      head :unauthorized
    end
  end

  def get_id
    if is_member_logged_in?
      render json: { id: session[:member_id] }, status: :ok
    else
      render json: {}, status: :unauthorized
    end
  end

  def destroy
    session.delete(:member_id)
    @current_member = nil
    head :no_content
  end
end
