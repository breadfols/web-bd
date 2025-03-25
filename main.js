import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const app = express();
const port = 80;

const secret = "secret";

const users = [
    {
        id: 1,
        login: "admin",
        password: "admin",
        role: "admin",
    },
    {
        id: 2,
        login: "user",
        password: "user",
        role: "user",
    },
    {
        id: 3,
        login: "staff",
        password: "staff",
        role: "staff",
    },
];

app.use(cookieParser());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile("1.html", { root: "pages" });
});

app.get("/second", (req, res) => {
    const token = req.cookies.token;

    if (token === undefined) {
        return res.status(403).send("Доступ запрещен");
    }

    try {
        const decoded = jwt.verify(token, secret);
        res.sendFile("second.html", { root: "pages" });
    } catch (err) {
        return res.status(403).send("Доступ запрещен");
    }
});

app.get("/telegram", (req,res)=>{
    const userData = req.query;
    console.log(userData);
    res.send("GOTOVO")
})
app.get("/auth", (req, res) => {
    const errors = {};
    const data = req.query;

    if (!data.login || data.login.length === 0) {
        errors["login"] = "Вы не указали логин";
    }

    if (!data.password || data.password.length === 0) {
        errors["password"] = "Вы не указали пароль";
    }

    if (Object.keys(errors).length > 0) {
        res.status(400).send(errors);
        return;
    }

    const findUser = users.find((i) => i.login === data.login && i.password === data.password);

    if (findUser === undefined) {
        res.status(401).send("Пользователь с таким логином и паролем не найден");
        return;
    }

    const token = jwt.sign({ id: findUser.id, role: findUser.role }, secret, { expiresIn: "1h" });

    res.cookie("token", token, { path: "/", httpOnly: true });

    if (findUser.role === "admin" || findUser.role === "staff") {
        res.redirect("/admin");
    } else if (findUser.role === "user") {
        res.redirect("/second");
    } else {
        res.redirect("/");
    }
});

app.get("/admin", (req, res) => {
    const token = req.cookies.token;

    if (token === undefined) {
        return res.status(403).send("Доступ запрещен");
    }

    try {
        const decoded = jwt.verify(token, secret);
        if (decoded.role === "admin" || decoded.role === "staff") {
            res.sendFile("admin.html", { root: "pages" });
        } else {
            res.redirect("/second");
        }
    } catch (err) {
        return res.status(403).send("Доступ запрещен");
    }
});

app.get("/logout", (req, res) => {
    try {
        res.clearCookie("token"); 
        res.redirect("/");
    } catch (err) {
        console.error("Ошибка при выполнении логаута:", err);
        res.status(500).send("Произошла ошибка при выходе из системы");
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});