const request = require('request')

const YT_URL = 'https://www.googleapis.com/youtube/v3/search'
const YT_API_KEY = 'AIzaSyDDP01Gnj3-wfoqM59xQz6pryJQhmYWCt8'
const YT_EMBED_URL = 'http://www.youtube.com/embed/'

const STATUS_OK = 200
/**
 * Queries YouTube for videos that match the given query.
 *
 * @param query -- the search query to send to YouTube
 *
 * Calls @param callback(error, results):
 *  error -- the error that occurred or null if no error
 *  results -- if error is null, contains the search results
 */
module.exports.search = (query, callback) => {
  const params = {
    key: YT_API_KEY,
    q: query,
    part: 'snippet',
    type: 'video'
  }
  request.get({
    url: YT_URL,
    qs: params
  }, function(error, response, body){
    if (error) {
      callback(error)
    } else if (response.statusCode !== STATUS_OK) {
      callback(new Error('Received bad status code: ' + response.statusCode))
    } else {
      const yt_results = JSON.parse(body).items.map(function(vid){
        return {
          title: vid.snippet.title,
          source: YT_EMBED_URL + vid.id.videoId
        }
      });
      callback(null, yt_results)
    }
  })
}
