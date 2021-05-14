const Client = {};

Client.socket = io.connect();

Client.sendMessages = function(name, msg) {
    console.log(name, msg);
    // ajouter comm dans MongoDB
    //addInDB(name, msg);
    Client.socket.emit("conv", name, msg);
}

// récupére de la DB les informations demandées
Client.socket.on("tsmsg", function(name, msg) {
    console.log(name, msg);
})



/*Client.addMessages(message) {
    document.getElementById("messages").append(`<h4> ${message.name} </h4><p> ${message.message} </p>`);
}



Client.sendMessage(message) {
    $.post('http://localhost:3000/messages', message);
}*/