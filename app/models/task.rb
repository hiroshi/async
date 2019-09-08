class Task < ApplicationRecord
  def done=(value)
    self.done_at = case value
    when "1"
      Time.now
    else
      nil
    end
  end
end
