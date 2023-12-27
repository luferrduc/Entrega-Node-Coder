import mongoose from "mongoose";


const ticketsCollection = 'tickets'
const ticketsSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true
  },
  purchase_datetime: {
    type: String,
    default: Date.now().toLocaleString()
  },
  amount: {
    type: Number
  },
  purchaser: {
    type: String
  }

})

const ticketModel = mongoose.model(ticketsCollection, ticketsSchema)

export default ticketModel