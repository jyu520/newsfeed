// anonymous, self-invoking function to limit scope
(function() {
  const PostModel = {}

  const POSTS_URL= '/posts'
  const STATUS_OK = 200
  /**
   * Loads all newsfeed posts from the server.
   *
   * Calls: callback(error, posts)
   *  error -- the error that occurred or null if no error occurred
   *  results -- an array of newsfeed posts
   */
  PostModel.loadAll = callback => {
    const request = new XMLHttpRequest()
    request.addEventListener('load', function(){
      if (request.status === STATUS_OK){
        var posts = JSON.parse(request.responseText)
        callback(null, posts)
      } else {
        callback(request.responseText)
      }
    })
    request.open('GET', POSTS_URL)
    request.send()
  }

  /* Adds the given post to the list of posts. The post must *not* have
   * an _id associated with it.
   *
   * Calls: callback(error, post)
   *  error -- the error that occurred or null if no error occurred
   *  post -- the post added, with an _id attribute
   */
  PostModel.add = (post, callback) => {
    const request = new XMLHttpRequest()

    request.addEventListener('load', function(){
      if (request.status === STATUS_OK){
        callback(null, JSON.parse(request.responseText))
      } else {
        callback(request.responseText)
      }
    })

    request.open('POST', POSTS_URL)
    request.setRequestHeader('Content-type', 'application/json')
    request.send(JSON.stringify(post));
  }

  /* Removes the post with the given id.
   *
   * Calls: callback(error)
   *  error -- the error that occurred or null if no error occurred
   */
  PostModel.remove = (id, callback) => {
    const request = new XMLHttpRequest()
    request.addEventListener('load', function(){
      if(request.status === STATUS_OK){
        callback(null);
      } else {
        callback(request.responseText)
      }
    })
    request.open('POST', POSTS_URL + '/remove')
    request.setRequestHeader('Content-type', 'application/json')
    request.send()
  }

  /* Upvotes the post with the given id.
   *
   * Calls: callback(error, post)
   *  error -- the error that occurred or null if no error occurred
   *  post -- the updated post model
   */
  PostModel.upvote = (id, callback) => {
    const request = new XMLHttpRequest()
    request.addEventListener('load', function(){
      if (request.status === STATUS_OK){
        callback(null, JSON.parse(request.responseText))
      } else {
        callback(request.responseText)
      }
    })
    request.open('POST', POSTS_URL + '/upvote')
    request.setRequestHeader('Content-type', 'application/json')
    request.send()
  }

  window.PostModel = PostModel
})()
