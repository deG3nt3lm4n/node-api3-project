const Users = require('../users/users-model')

function logger(req, res, next) {
  // DO YOUR MAGIC
  req.requestTime = Date.now()
  console.log(req.method, req.originalUrl, req.requestTime)
  next()
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  const { id } = req.params

  if(!id){
    res.status(404).json({message: 'id not valid'})
  }

  try {
    const user = await Users.getById(id)

    if(!user){
      res.status(404).json({message: 'user doesnt exists'})
    }else{
      req.user = user
      next()
    }

  } catch (error) {
    res.status(500).json({message: error.message})
  }

}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  const userData = req.body

  if(!userData.name){
    res.status(400).json({ message: "missing required name field" })
  }else{
    req.name = userData
    next()
  }

}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
}

// do not forget to expose these functions to other modules

module.exports = {
  logger,
  validateUserId,
  validateUser
}