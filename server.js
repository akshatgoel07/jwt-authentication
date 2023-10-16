require("dotenv").config();
// importing express
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

// this lets our server use the json we pass to the body
app.use(express.json());

// get route to get all of our posts
// app.get( path, callback)
// path: It is the path for which the middleware function is being called.
// callback: They can be a middleware function or a series/array of middleware functions.
const posts = [
	{
		username: "Ak",
		title: "Post1",
	},
	{
		username: "Jim",
		title: "Post2",
	},
];

// when a client makes a post request to localhost3000/posts this will run
app.get("/posts", (req, res) => {
	// this line sends the response back to the client
	// res.json(posts);

	app.get("/posts", authenticateToken, (req, res) => {
		res.json(posts.filter((post) => post.username === req.user.name));
	});
});

// using post because we need to get a token
app.post("/login", function (req, res) {
	var username = req.body.username;
	var user = { name: username };
	var accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
	res.json({ accessToken: accessToken });
});

// middleware
function authenticateToken(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) return res.sendStatus(401);

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
}

// our application running on port 3000
app.listen(3000);
