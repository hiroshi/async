class AddCheckedToTask < ActiveRecord::Migration[6.0]
  def change
    add_column :tasks, :checked, :boolean
    remove_column :tasks, :orderdate
    add_column :tasks, :order, :decimal
  end
end
