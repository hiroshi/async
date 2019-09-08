class CreateTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :tasks do |t|
      t.string :name, null: false
      t.datetime :orderdate
      t.jsonb :meta
      t.datetime :done_at
      t.timestamps
    end
  end
end
