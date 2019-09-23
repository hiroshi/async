class TasksController < ApplicationController
  def index
    respond_to do |format|
      format.html
      format.json do
        render json: Task.order(:id).all
      end
    end
  end

  def create
    task = Task.create!(params.permit(:name))
    publish('tasks.new', task)
    head :ok
  end

  def update
    task = Task.find(params[:id])
    task.update!(task_params)
    publish("tasks.#{task.id}.update", task)
    head :ok
  end

  private

  def task_params
    params.permit(:done)
  end

  def publish(room, task)
    RestClient.post(
      'http://sp.async.lvh.me:3200/publish',
      { room: room, args: [task.as_json(only: [:id, :name, :done_at])] }.to_json,
      { content_type: :json, accept: :json }
    )
  end
end
