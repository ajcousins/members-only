const path = require("path");
const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");

const viewRouter = require("./routes/viewRouter");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// MIDDLEWARE
app.use(helmet());
app.use(compression());

// Static files to be served from public folder
app.use(express.static(path.join(__dirname, "public")));

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ROUTES
app.use("/", viewRouter);

// START SERVER
module.exports = app;
