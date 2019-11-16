class TasksController < ApplicationController
  def index
    respond_to do |format|
      format.html
      format.json do
        query = { done: ActiveModel::Type::Boolean.new.cast(params[:done]) }
        render json: get_tasks(query)
      end
    end
  end

  def create
    Task.create!(params.permit(:name))
    # publish('tasks.new', task)

    # TODO: publish only if subscribed
    publishTasks('tasks?done=false', get_tasks(done: false))

    head :ok
  end

  def update
    task = Task.find(params[:id])
    task.update!(task_params)
    # publishTask("tasks.#{task.id}.update", task)

    # TODO: publish only if subscribed
    publishTasks('tasks?done=false', get_tasks(done: false))
    publishTasks('tasks?done=true', get_tasks(done: true))

    head :ok
  end

  private

  def get_tasks(query)
    tasks = Task.all
    if query[:done]
      tasks.where.not(done_at: nil).limit(3).order(updated_at: :desc).reverse
    else
      tasks.where(done_at: nil).order(checked: :desc, order: :desc)
    end
  end

  def task_params
    params.require(:task).permit(:done, :checked, :name)
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
