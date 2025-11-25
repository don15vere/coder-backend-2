import TicketDao from "../dao/mongo/ticket.dao.js";
import { v4 as uuidv4 } from "uuid";

const ticketDao = new TicketDao();

export default class TicketService {
  async createTicket({ amount, purchaser }) {
    const code = uuidv4();
    return ticketDao.create({ code, amount, purchaser });
  }
}