function connexionMongo() {
    // make a connexion 
    const dbUrl = "mongodb+srv://FredBail:S3xBLma5CV3nHSd@cluster0.cbidg.mongodb.net/Cluster0?retryWrites=true&w=majority";
    mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        })
        .then(() => { console.log('Connexion à MongoDB réussie !') })
        .catch(() => { console.log('Connexion à MongoDB échouée !') });
    return mongoose.connection;
}