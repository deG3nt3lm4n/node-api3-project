const express = require('express');
const mw = require('../middleware/middleware')
const Users = require('./users-model')
const Posts = require('../posts/posts-model')


// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get()
    .then(data => {
      res.status(200).json(data)
    })
    .catch(err => next(err))
});

router.get('/:id', mw.validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user)
});

router.post('/',mw.validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  Users.insert(req.body)
    .then(data => {
      if(!data){
        res.status(404).json('Invalid user')
      }else{
        res.status(201).json(data)
      }
    })
    .catch(err => next(err))
});

router.put('/:id',mw.validateUserId,mw.validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const {id} = req.params
  Users.update(id, req.body )
    .then(() => {
      return Users.getById(id)
    })
    .then(user =>{
      res.json(user)
    })
    .catch(err => next(err))
});

router.delete('/:id',mw.validateUserId, async (req, res,next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
    try {
      await Users.remove(req.params.id)
      res.json(req.user)
    } catch (error) {
      next(error)
    }

});

router.get('/:id/posts',mw.validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id

  try {

    const result = await Users.getUserPosts(req.params.id)
    res.status(200).json(result)

  } catch (error) {
    next(error)
  }

});

router.post('/:id/posts',mw.validateUserId,mw.validatePost, async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const bb = {
    user_id: req.params.id,
    text: req.body.text
  }

  try {

    const postResult = await Posts.insert(bb)
    res.status(200).json(postResult)

  } catch (error) {
    next(error)
  }


});

router.use((err,req,res,next) => {
  res.status(500).json({
    message: 'Something broken',
    error: err.message
  })
})

// do not forget to export the router
module.exports = router