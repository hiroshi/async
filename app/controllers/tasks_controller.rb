class TasksController < ApplicationController
  def index
    respond_to do |format|
      format.html
      format.json do
        render json: Task.where(done_at: nil).order(:id).all
      end
    end
  end

  def create
    Task.create!(params.permit(:name))
    # publish('tasks.new', task)

    # TODO: publish only if subscribed
    tasks = Task.where(done_at: nil).order(:id).all
    publishTasks('tasks?done=false', tasks)

    head :ok
  end

  def update
    task = Task.find(params[:id])
    task.update!(task_params)
    # publishTask("tasks.#{task.id}.update", task)

    # TODO: publish only if subscribed
    tasks = Task.where(done_at: nil).order(:id).all
    publishTasks('tasks?done=false', tasks)

    head :ok
  end

  private

  def task_params
    params.permit(:done)
  end

  def publishTask(room, task)
    publish(room, task.as_json(only: [:id, :name, :done_at]))
  end

  def publishTasks(room, tasks)
    publish(room, tasks.as_json)
  end

  def publish(room, payload)
    RestClient.post(
      ENV['SOCKET_PROXY_URL'] + 'publish',
      { room: room, args: [payload] }.to_json,
      { content_type: :json, accept: :json }
    )
  end
end
