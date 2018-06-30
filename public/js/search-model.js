// anonymous, self-invoking function to limit scope
(function() {
  const SearchModel = {}

  const SEARCH_URL = '/search'
  const STATUS_OK = 200

  /**
   * Loads API search results for a given query.
   *
   * Calls: callback(error, results)
   *  error -- the error that occurred or NULL if no error occurred
   *  results -- an array of search results
   */
  SearchModel.search = (query, callback) => {
    const request = new XMLHttpRequest()
    request.addEventListener('load', function(){
      if (request.status === STATUS_OK){
        callback(null, JSON.parse(request.responseText))
      } else {
        callback(request.responseText)
      }
    });

    request.open('GET', SEARCH_URL + '?query=' + encodeURIComponent(query))
    request.send()
  }

  window.SearchModel = SearchModel
})()
