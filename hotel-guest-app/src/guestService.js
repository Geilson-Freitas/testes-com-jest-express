const { randomUUID } = require("node:crypto");
const { getGuestValidationErrors } = require("./validation");

const guests = [];

function createGuest(data) {
	const errors = getGuestValidationErrors(data);

	if (errors.length > 0) {
		const error = new Error("Os dados do hóspede são inválidos.");
		error.status = 400;
		error.details = errors;
		throw error;
	}

	const guest = {
		id: randomUUID(),
		name: data.name.trim(),
		email: data.email.trim(),
		phone: data.phone.trim(),
		checkIn: data.checkIn,
		checkOut: data.checkOut,
		guests: data.guests,
	};

	guests.push(guest);
	return guest;
}

module.exports = { createGuest };
