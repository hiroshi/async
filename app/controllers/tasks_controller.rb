class TasksController < ApplicationController
  def index
    respond_to do |format|
      format.html
      format.json do
        render json: Tasks.all
      end
    end
  end

  def create
    task = Task.new(params.permit(:name))
    RestClient.post(
      'http://sp.async.lvh.me:3200/publish',
      { room: 'tasks.new', args: [task.as_json(only: [:id, :name])] }.to_json,
      { content_type: :json, accept: :json }
    )
    head :ok
  end
end
