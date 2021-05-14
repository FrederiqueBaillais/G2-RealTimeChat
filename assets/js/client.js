const Client = {};

Client.socket = io.connect();

Client.sendMessages = function(name, msg) {
    console.log(name, msg);
    // ajouter comm dans MongoDB
    addInDB(name, msg);
    Client.socket.emit("conv", name, msg);
}

// récupére de la DB les informations demandées
Client.socket.on("tsmsg", function(name, msg) {
    console.log(name, msg);
})

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

/*Client.addMessages(message) {
    document.getElementById("messages").append(`<h4> ${message.name} </h4><p> ${message.message} </p>`);
}



Client.sendMessage(message) {
    $.post('http://localhost:3000/messages', message);
}*/