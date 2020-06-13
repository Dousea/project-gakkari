class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def current_member
    @current_member ||= User.find(session[:member_id]) if session[:member_id]
  end

  def is_member_logged_in?
    !!session[:member_id]
  end
end
