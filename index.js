// require your server and launch it
const server = require('./api/server')

const PORT = 3001;

server.listen(PORT, () => {
  console.log('Listing to port: ',PORT)
})