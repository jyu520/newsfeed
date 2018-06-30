const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const flickr = require('./lib/soundcloud')
const youtube = require('./lib/youtube')
const soundcloud = require('./lib/soundcloud')

const Post = require('./lib/post')

const STATUS_OK = 200
const STATUS_USER_ERROR = 422
const numberOfAPIS = 3

// connect to database
mongoose.connect('mongodb://localhost:27017/callback-newsfeed-db')

const server = express()
// serve all files out of public folder
server.use(express.static('public'))

// parse json bodies in post requests
server.use(bodyParser.json())

// get news feed home page
server.get('/', function(request,response){
    response.render('index.html');
})

// Make search API calls
server.get('/search', function(request, response) {
    const query = request.query.query
    const allSearchResults = []
    let numAPIFinished = 0

    flickr.search(query, function(error, res){
        if (error){
            throw error
        }

        if (res.length > 0 ){
            res[0].api = 'flickr'
            allSearchResults.push(res[0])
        }

        numAPIFinished++

        if (numAPIFinished === numberOfAPIS){
            response.status(STATUS_OK).send(allSearchResults) 
        }

    })

    soundcloud.search(query, function(error, res){
        if (error){
            throw error
        }

        if (res.length > 0 ){
            res[0].api = 'soundcloud'
            allSearchResults.push(res[0])
        }

        numAPIFinished++

        if (numAPIFinished === numberOfAPIS){
            response.status(STATUS_OK).send(allSearchResults) 
        }

    })

    youtube.search(query, function(error, res){
        if (error){
            throw error
        }

        if (res.length > 0 ){
            res[0].api = 'youtube'
            allSearchResults.push(res[0])
        }

        numAPIFinished++

        if (numAPIFinished === numberOfAPIS){
            response.status(STATUS_OK).send(allSearchResults) 
        }

    })

})
// retrieve all posts from the database
server.get('/posts', function(request, response){
    Post.find({}, function(error, posts){
        if (error){
            throw error
        }
        response.status(STATUS_OK).send(posts)
    })
})

server.post('/posts', function(request, response){
    let newPost = new Post({
        api: request.body.api,
        source: request.body.source,
        title: request.body.title,
        upvotes: 0
    })

    if (newPost.api === undefined || newPost.source === undefined || newPost.title === undefined){
        response.status(422).send("Missing a parameter")
    }

    newPost.save(function(error){
        if (error){
            throw error
        }
        response.set({'Content-type': 'application/json'})
        response.status(STATUS_OK).send(newPost);
    })

})

server.post('/posts/remove', function(request, response){
    Post.remove({ _id: request.body.id }, function(error){
        if (error){
            throw error
        }
        response.send(STATUS_OK)

    })
})

server.post('/posts/upvote', function(request, response){
    Post.findById( request.body.id , function(error, post){
        if (error){
            throw error
        } else {
            console.log(post)
            post.upvotes++
            post.save( function(err){
                if (err){
                    throw err
                } else {
                    response.set({'Content-type': 'application/json'})
                    response.status(STATUS_OK).send(post)
                }
            })
        }
    })
})

server.listen(3000)
console.log('Listening at 127.0.0.1:' + 3000)
