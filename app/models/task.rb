class Task < ApplicationRecord
  # scope :done => (value) { value}

  def done=(value)
    if ActiveModel::Type::Boolean.new.cast(value)
      self.done_at = Time.now
    else
      self.done_at = nil
    end
  end

  before_create do
    self.order = Time.now.to_f
  end

  before_save do
    if checked_changed?
      self.order = Time.now.to_f
    end
  end
end
