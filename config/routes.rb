Rails.application.routes.draw do
  get '/socket-proxy/auth', to: 'application#socket_proxy_auth'
  resources :tasks, only: [:index, :create, :update], format: false
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
