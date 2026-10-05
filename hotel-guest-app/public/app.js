const guestForm = document.querySelector("#guest-form");
const checkInInput = document.querySelector("#check-in");
const checkOutInput = document.querySelector("#check-out");
const formStatus = document.querySelector("#form-status");

checkInInput.addEventListener("change", () => {
	checkOutInput.min = checkInInput.value;

	if (checkOutInput.value && checkOutInput.value < checkInInput.value) {
		checkOutInput.value = "";
	}
});

guestForm.addEventListener("submit", async (event) => {
	event.preventDefault();

	if (!guestForm.reportValidity()) {
		return;
	}

	const submitButton = guestForm.querySelector("button[type='submit']");
	const formData = new FormData(guestForm);
	const guest = {
		name: formData.get("fullName"),
		email: formData.get("email"),
		phone: formData.get("phone"),
		checkIn: formData.get("checkIn"),
		checkOut: formData.get("checkOut"),
		guests: Number(formData.get("guestCount")),
	};

	submitButton.disabled = true;
	formStatus.textContent = "Enviando cadastro...";

	try {
		const response = await fetch("/guests", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(guest),
		});
		const result = await response.json();

		if (!response.ok) {
			formStatus.textContent = result.details?.map((error) => error.message).join(" ") || result.error;
			return;
		}

		guestForm.reset();
		checkOutInput.min = "";
		formStatus.textContent = result.message;
	} catch {
		formStatus.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
	} finally {
		submitButton.disabled = false;
	}
});
