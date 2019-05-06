const mongoose = require('mongoose')
const Schema = mongoose.Schema



const thingsSchema = new Schema({
  doing : String,
  idForUser : String
})

const Things = mongoose.model('Things', thingsSchema)

module.exports = Things
