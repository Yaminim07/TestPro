const mongoose = require('mongoose')
const schema = mongoose.Schema;

const userSchema = new schema({
  username: String,
  googleId: String,
  image: String,
  isHost: Boolean
});


const User = mongoose.model('user',userSchema)

module.exports = User;

