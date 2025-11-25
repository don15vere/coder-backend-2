import ticketModel from "../../models/tickets.model.js";

export default class TicketDao {
  create(ticketData) {
    return ticketModel.create(ticketData);
  }
}