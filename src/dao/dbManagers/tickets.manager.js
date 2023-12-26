import ticketsModel from './models/tickets.model.js'


export default class Tickets {
  
  create = async (ticket) => {
      return await ticketsModel.create(ticket);
  }
}