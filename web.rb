['yaml', 'right_aws', 'sinatra/base', 'json'].each {|r| require r }
Dir["mixins/**/*.rb"].sort.each {|file| require_relative file if file.include?(".rb") }
Dir["models/**/*.rb"].sort.each {|file| require_relative file if file.include?(".rb") }

class Web < Sinatra::Base

  get '/' do
    erb :base
  end

  get '/sqs.json' do
    content_type :json
    status 200
    queue_data_hash.to_json
  end

  private

  def queue_data_hash
    alpha_queues.inject({}) {|hash,queue| hash[queue.name] = queue.size; hash}
  end

  def alpha_queues
    queues = Queue.new.list
    queues.select {|queue| queue.name.downcase.include?("alpha")}
  end

end
