class CreateTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :tasks do |t|
      t.string :name
      t.datetime :orderdate
      t.jsonb :meta
      t.timestamps
    end
  end
end
