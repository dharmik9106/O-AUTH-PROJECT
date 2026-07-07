import express from "express";
import HttpError from "./mideleware/HttpError.js";
import connectDB from "./config/db.js";

import authRoutes from "./route/authRoute.js"
import profileRoutes from "./route/profileRoute.js"
import passport from "./config/passport.js";


import dotenv from "dotenv"
import session from "express-session";

dotenv.config({ path: "./.env" })

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }

}))

app.use(passport.initialize());

app.use(passport.session())

app.set("view engine", "ejs")

app.use(express.json());

app.use("/auth", authRoutes)

app.use("/profile", profileRoutes)




app.get("/", (req, res) => {
    res.render("home",{user:req.user})
});

app.use((req, res, next) => {
    return next(new HttpError("requested route not found", 404));
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    res
        .status(error.statusCode || 500)
        .json({ message: error.message || "internal server error" });
});

const port = process.env.PORT || 5000;

async function startServer() {
    try {
        const connect = await connectDB();

        if (!connect) {
            throw new Error("failed to connect db");
        }
        app.listen(port, (err) => {
            if (err) {
                return console.log(err.message);
            }

            console.log(`server running port ${port}`);
        });
    } catch (error) {
        console.log(error.message);

        process.exit(1);
    }
}
startServer();