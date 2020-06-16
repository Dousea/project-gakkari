class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def current_user
    @current_user ||= Administrator.find(session[:user_id]) if session[:user_id]
  end

  def is_user_logged_in?
    !!session[:user_id] && Administrator.exists?(session[:user_id])
  end
end
