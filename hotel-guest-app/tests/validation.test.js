const { validateGuest } = require("../src/validation");

const validGuest = {
	name: "John Smith",
	email: "john@example.com",
	phone: "555123456",
	checkIn: "2026-10-10",
	checkOut: "2026-10-15",
	guests: 2,
};

describe("validateGuest", () => {
	test("retorna true para um hospede valido", () => {
		expect(validateGuest(validGuest)).toBe(true);
	});

	test("retorna false quando o nome esta vazio", () => {
		expect(validateGuest({ ...validGuest, name: "" })).toBe(false);
	});

	test("retorna false quando o e-mail e invalido", () => {
		expect(validateGuest({ ...validGuest, email: "johnexample.com" })).toBe(false);
	});

	test("retorna false quando o check-out antecede o check-in", () => {
		expect(validateGuest({ ...validGuest, checkOut: "2026-10-09" })).toBe(false);
	});
});
