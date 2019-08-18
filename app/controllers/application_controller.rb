class ApplicationController < ActionController::Base
  def socket_proxy_auth
    head :ok
  end
end
