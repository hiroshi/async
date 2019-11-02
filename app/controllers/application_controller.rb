class ApplicationController < ActionController::Base
  def socket_proxy_auth
    rooms = Rails.cache.read('rooms') || {}
    room_name = params[:room]
    unless rooms.key?(room_name)
      rooms[room_name] = true
      Rails.cache.write('rooms', rooms)
    end
    pp rooms
    head :ok
  end
end
