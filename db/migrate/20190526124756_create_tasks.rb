class CreateTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :tasks do |t|
      t.string :name, null: false
      t.boolean :checked, null: false, default: false
      t.decimal :order, null: false
      t.datetime :done_at
      t.timestamps
    end
  end
end
