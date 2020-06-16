Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # Sessions
      get 'get_session', to: 'sessions#show'
      post 'create_session', to: 'sessions#create'
      delete 'delete_session', to: 'sessions#destroy'

      # Administrators
      get 'administrator/:id', to: 'administrators#show'

      # Members
      get 'members', to: 'members#index'
      get 'member/:id', to: 'members#show'

      # Transactions
      get 'transactions', to: 'transactions#index'

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
