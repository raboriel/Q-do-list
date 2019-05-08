const mongoose = require('mongoose')
const Schema = mongoose.Schema



const nothingsSchema = new Schema({
  doing : String,
  idForUser : String
})

const Nothings = mongoose.model('Nothings', nothingsSchema)

module.exports = Nothings
