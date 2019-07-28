Rails.application.routes.draw do
  resources :tasks, only: [:index, :create], format: false
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
