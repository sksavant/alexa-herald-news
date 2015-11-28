#require 'rack/ssl'
require 'httparty'
#require 'jawbone'
require 'csv'
require 'json'
require 'sinatra'


configure do
  set :base_url, "http://cdn.newsapi.com.au/content/v2/"
  set :api_key, "f2qtvndyfh4ensub44utdwtf"
  set :rel_keys, ["title", "id", "subtitle", "description", "authors", "body"]
  enable :sessions
  #use Rack::SSL
end

get '/' do
  erb 'Hello!'
end

def story_url(news_id)
    url = "" << settings.base_url << news_id <<  "?api_key=" << settings.api_key
    url
end

def firehose_url(num, date=nil)
    url = "" << settings.base_url << "?api_key=" << settings.api_key << "&query=contentType:news_story" << "&pageSize=" << num.to_s << "&includeBodies=true"
    url
end

def collection_url(id, num=20)
    "" << settings.base_url << "collection/" << id << "?api_key=" << settings.api_key << "&includeRelated=true" << "&pageSize=" << num.to_s
end

get '/test' do
  @news_id = "ad8dd851fc70756ef81bc81acfdb8ae5"
  response = HTTParty.get(story_url(@news_id))
  output = JSON.parse(response.body)
  erb 'News title: ' << output["title"] << "</br>" << 'Body : ' << output["body"]

end

get '/test/firehose' do
  num = 100
  num = params["num"].to_i if params["num"]
  puts 'NUM ' << num.to_s
  response = HTTParty.get(firehose_url(num))
  #puts firehose_url(num)
  output = JSON.parse(response.body)
  dis = ""
  output["results"].each do |r|
    dis << 'News title: ' << r["title"] << "</br>"
  end
  erb dis

end

get '/story.json' do
  content_type :json, 'charset' => 'utf-8'
  news_id = "ad8dd851fc70756ef81bc81acfdb8ae5"
  news_id = params["id"] if params["id"]
  response = HTTParty.get(story_url(news_id))
  output = JSON.parse(response.body).to_hash
  output.delete_if { |k,v| !settings.rel_keys.include? k }.to_json
end


get '/firehose.json' do
  content_type :json, 'charset' => 'utf-8'
  num = 100
  num = params["num"].to_i if params["num"]
  response = HTTParty.get(firehose_url(num))
  #puts firehose_url(num)
  output = JSON.parse(response.body)
  j = []
  output["results"].each do |r|
    j << r.delete_if {|k,v| !settings.rel_keys.include? k }
  end
  j.to_json
end

get '/collection.json' do
  content_type :json, 'charset' => 'utf-8'
  col_id = "517ed3c64dda2f97fa940ad29b73ba4c"
  col_id = params["id"] if params["id"]
  num = 20
  num = params["num"].to_i if params["num"]
  response = HTTParty.get(collection_url(col_id, num))
  puts 'Col ' << collection_url(col_id, num)
  #puts firehose_url(num)
  output = JSON.parse(response.body)
  j = []
  output["results"].each do |r|
    j << r.delete_if {|k,v| !settings.rel_keys.include? k }
  end
  j.to_json
end
