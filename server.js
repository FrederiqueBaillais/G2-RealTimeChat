const mongoose = require('mongoose'); // npm install mongoose
const express = require('express'); // npm install express 
const bodyparser = require('body-parser'); // npm install body-parser
const app = express();
const fs = require('fs'); // npm install fs
const http = require('http').createServer(app); // npm install http
const io = require('socket.io')(http); // npm install socket.io
// npm install prototype // npm ci
const path = require('path'); // npm install path

const dbUrl = "mongodb+srv://FredBail:S3xBLma5CV3nHSd@cluster0.cbidg.mongodb.net/Cluster0?retryWrites=true&w=majority";
const Message = mongoose.model('Message', { name: String, message: String });

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
        console.log(messages);
        res.send(messages);
    })
});

app.post('/messages', async(req, res) => {
    try {
        let message = new Message(req.body);

        let savedMessage = await message.save();
        console.log('saved');

        let censored = await Message.findOne({ message: 'badword' });
        if (censored) {
            await Message.remove({ _id: censored.id });
        } else {
            io.emit('message', req.body);
        }
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
        return console.log('error', error);
    } finally {
        console.log('Message Posted');
    }
});

io.on('connection', function(socket) {
    console.log('a user is connected');
    socket.on("conv", function(name, msg) { // conv = le contenu de l'entrée par l'utilisateur
        console.log("that's ok");
        addInDB(name, msg);
        io.emit("tsmsg", name, msg); // tsmsg = tous les messagers
    });

});

// ajoute les infos dans la DB
function addInDB(username, messag) {
    console.log('Ca fonctionne ?');

    // get reference to database
    let db = connexionMongo();

    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', function() {
        console.log("Connexion Successfull !");

        // define Schema
        var MsgSchema = mongoose.Schema({
            name: String,
            msg: String
        });

        // compile schema to model
        let Msg = mongoose.model('conversation', MsgSchema, 'Cluster0');

        // a document instance
        let msg1 = new Msg({ name: username, msg: messag });

        // save model to database
        msg1.save(function(err, book) {
            if (err) return console.error(err);
            console.log(book.name + " added in collection.");

        });

    });
}