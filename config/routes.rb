Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'books/index'
      post 'books/create'
      patch 'books/:id', to: 'books#update'
      get '/show/:id', to: 'books#show'
      delete '/destroy/:id', to: 'books#destroy'
    end
  end

  root 'home#index'
  get '/*path' => 'home#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
