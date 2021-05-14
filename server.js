const mongoose = require('mongoose');
const express = require('express');
const bodyparser = require('body-parser');

//const dbUrl = "mongodb+srv://user1:user1@chat2.tvgl2.mongodb.net/chat2?retryWrites=true&w=majority";
const dbUrl = "mongodb+srv://FredBail:S3xBLma5CV3nHSd@cluster0.cbidg.mongodb.net/Cluster0?retryWrites=true&w=majority";
const Message = mongoose.model('Message', { name: String, message: String });
const app = express();

mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => { console.log('Connexion à MongoDB réussie !') })
    .catch(() => { console.log('Connexion à MongoDB échouée !') });

const server = app.listen(3000, () => {
    console.log('server is running on port', server.address().port);
});
app.use(express.static(__dirname));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    })
});

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) => {
        if (err) {
            sendStatus(500);
        }
        res.sendStatus(200);
    });
});