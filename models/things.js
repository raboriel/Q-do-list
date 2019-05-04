const mongoose = require('mongoose')
const Schema = mongoose.Schema



const thingsSchema = Schema({
  doing : String,
  done : {type: Boolean, default: false}
})

const Things = mongoose.model('Things', thingsSchema)

module.exports = Things
