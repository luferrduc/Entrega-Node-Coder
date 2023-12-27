import { Tickets as TicketsDao } from "../dao/factory.js";

export default class TicketsRepository {
  constructor(){
    this.dao = new TicketsDao()
  }

  create = async (ticket) => {
    const result = await this.dao.create(ticket)
    return result
  }
}