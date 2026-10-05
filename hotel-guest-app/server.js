const path = require("node:path");
const express = require("express");
const { createGuest } = require("./src/guestService");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/guests", (req, res, next) => {
	try {
		const guest = createGuest(req.body);
		res.status(201).json({ message: "Hóspede cadastrado com sucesso.", guest });
	} catch (error) {
		next(error);
	}
});

app.use((error, req, res, next) => {
	if (res.headersSent) {
		return next(error);
	}

	if (error.type === "entity.parse.failed") {
		return res.status(400).json({ error: "O corpo da requisição contém JSON inválido." });
	}

	if (error.status === 400) {
		return res.status(400).json({ error: error.message, details: error.details });
	}

	return res.status(500).json({ error: "Erro interno do servidor." });
});

if (require.main === module) {
	app.listen(port, () => {
		console.log(`Hotel Guest App disponível em http://localhost:${port}`);
	});
}

module.exports = app;
