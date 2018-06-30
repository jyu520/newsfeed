// anonymous, self-invoking function to limit scope
(function() {
  const NewsfeedView = {}

  /* Renders the newsfeed into the given newsfeedElement element. */
  NewsfeedView.render = newsfeedElement => {
    PostModel.loadAll(function(error, res){
      if (error){
        document.getElementsByClassName('error').html(error);
      } else {
        res.forEach(function(post){
          NewsfeedView.renderPost(newsfeedElement, post, false)
        })
      }
    })
  }

  /* Given post information, renders a post element into newsfeedElement. */
  NewsfeedView.renderPost = (newsfeedElement, post) => {
    var postHtml = Templates.renderPost(post);
    newsfeedElement.append(postHtml)

    
    postHtml.getElementsByClassName('remove').item(0).addEventListener('click', function(event){
      PostModel.remove(post._id, function(error){
        if (error){
          document.getElementsByClassName('error').html(error);
        } else {
          Grid.remove(postHtml)
        }
      })
    })

    postHtml.getElementsByClassName('upvote').item(0).addEventListener('click', function(event){
      PostModel.upvote(post._id, function(error, post){
        if (error){
          document.getElementsByClassName('error').html(error);
        } else {
          postHtml.getElementsByClassName('upvote-count').html(post.upvotes);
          Grid.remove(postHtml)
        }
      })
    })


  }

  window.NewsfeedView = NewsfeedView
})()
