function isValidDate(value) {
	if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		return false;
	}

	const date = new Date(`${value}T00:00:00.000Z`);
	return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function getGuestValidationErrors(guest) {
	const errors = [];

	if (!guest || typeof guest !== "object" || Array.isArray(guest)) {
		return [{ field: "body", message: "O corpo da requisição deve ser um objeto JSON." }];
	}

	if (typeof guest.name !== "string" || guest.name.trim().length < 2) {
		errors.push({ field: "name", message: "Informe o nome completo do hóspede." });
	}

	if (typeof guest.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email.trim())) {
		errors.push({ field: "email", message: "Informe um e-mail válido." });
	}

	if (typeof guest.phone !== "string") {
		errors.push({ field: "phone", message: "Informe um telefone válido." });
	} else {
		const phone = guest.phone.trim();
		const digits = phone.replace(/\D/g, "").length;

		if (!/^\+?[\d\s().-]+$/.test(phone) || digits < 7 || digits > 15) {
			errors.push({ field: "phone", message: "O telefone deve conter entre 7 e 15 dígitos." });
		}
	}

	const checkInIsValid = isValidDate(guest.checkIn);
	const checkOutIsValid = isValidDate(guest.checkOut);

	if (!checkInIsValid) {
		errors.push({ field: "checkIn", message: "Informe uma data de check-in válida no formato AAAA-MM-DD." });
	}

	if (!checkOutIsValid) {
		errors.push({ field: "checkOut", message: "Informe uma data de check-out válida no formato AAAA-MM-DD." });
	} else if (checkInIsValid && guest.checkOut <= guest.checkIn) {
		errors.push({ field: "checkOut", message: "O check-out deve ocorrer após o check-in." });
	}

	if (!Number.isSafeInteger(guest.guests) || guest.guests < 1) {
		errors.push({ field: "guests", message: "O número de hóspedes deve ser um inteiro maior que zero." });
	}

	return errors;
}

function validateGuest(guest) {
	return getGuestValidationErrors(guest).length === 0;
}

module.exports = { getGuestValidationErrors, validateGuest };
