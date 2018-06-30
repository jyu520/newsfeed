const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    api: String,
    source: String,
    title: String,
    upvotes: Number
})

const Post = mongoose.model('Post', postSchema)
module.exports = Post