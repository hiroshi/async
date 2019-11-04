class Task < ApplicationRecord
  # scope :done => (value) { value}

  def done=(value)
    if ActiveModel::Type::Boolean.new.cast(value)
      self.done_at = Time.now
    else
      self.done_at = nil
    end
  end
end
