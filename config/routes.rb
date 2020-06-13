Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # Sessions
      post 'sessions/create'
      post 'sessions/get_id'
      delete 'sessions/destroy'

      # Members
      post 'members/show/:id', to: 'members#show'

      # Books
      get 'books/index'
      post 'books/create'
      patch 'books/:id', to: 'books#update'
      get 'books/show/:id', to: 'books#show'
      delete 'books/destroy/:id', to: 'books#destroy'
    end
  end

  root 'home#index'
  get '/*path' => 'home#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
