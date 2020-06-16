class Api::V1::SessionsController < ApplicationController
  def create
    administrator = Administrator.find_by(username: session_params[:username])

    if administrator && administrator.authenticate(session_params[:password])
      session[:user_id] = administrator.id.to_s
      head :ok
    else
      head :unauthorized
    end
  end

  def show
    if is_user_logged_in?
      render json: { id: session[:user_id] }, status: :ok
    else
      render json: {}, status: :unauthorized
    end
  end

  def destroy
    session.delete(:user_id)
    @current_user = nil
    head :no_content
  end

  private

  def session_params
    params.require(:session).permit(:username, :password)
  end
end
