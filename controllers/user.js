const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

exports.signup = (req, res, next) => {
    let usernam = escapeHtml(username);
    bcrypt
        .hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                username: usernam,
                password: hash,
            });
            user.save()
                .then(() =>
                    res
                    .status(201)
                    .redirect("../index.html")
                    .json({ message: "User created!" })
                )
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    escapeHtml(username);
    User.findOne({ username: req.body.username })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: "No user found!" });
            }
            bcrypt
                .compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res
                            .status(401)
                            .json({ error: "Incorrect password!" });
                    }
                    res.status(200)
                        .redirect(`../chat.html?username=${user.username}&room=${req.body.room}`)
                        .json({
                            userId: user._id,
                            token: jwt.sign({ userId: user._id },
                                "RANDOM_TOKEN_SECRET", { expiresIn: "24h" }
                            ),
                        });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};