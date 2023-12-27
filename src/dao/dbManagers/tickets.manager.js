import ticketsModel from "./models/tickets.model.js";

export default class Tickets {
	create = async (ticket) => {
		const result = await ticketsModel.create(ticket);
		return result;
	};
}
