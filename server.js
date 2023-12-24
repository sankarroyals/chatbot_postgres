const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

app.get("/api", (req, res) => {
	try {
		console.log(res)
		res.json({status: res.status, message: 'welcome chat bot'});
	  } catch (err) {
		console.log(err);
	  }
});


app.listen(process.env.PORT, () => {
	console.log(`Running at http://localhost:${process.env.PORT}/api`);
});