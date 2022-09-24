const path = require("path");
const express = require("express");

const Searcher = require("./Searcher");
const Storage  = require("./Storage");

class Server {
    static PATHS = {
        INDEX: path.join(__dirname, "../views/index.html")
    };

    constructor() {
        this.app = express();

        this.app.use(express.static(path.join(__dirname, "../www")))

        this.app.get("/", (req, res) => {
            res.sendFile(Server.PATHS.INDEX);
        });

        this.app.get("/api/entities", async (req, res) => {
            res.send(Object.values(await Storage.listEntities()));
        });

        this.app.get("/api/paths", async (req, res) => {
            const from = (req.query.from || "").split(",").filter(Boolean);
            const to = (req.query.to || "").split(",").filter(Boolean);

            if (!from.length)
                return res.status(400).send({error: `"from" cannot be empty`});

            res.send(await Searcher.getPaths(from, to));
        });

        void Storage.load();
    }

    listen(port) {
        return new Promise(resolve => {
            this.app.listen(port, () => {
                console.log("Dezoofier server listening on port", port);
                resolve();
            });
        })
    }
}

module.exports = Server;
