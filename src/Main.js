const Server  = require("./Server");

const config = require("../config.json");

class Main {
    static async main() {
        const server = new Server();

        await server.listen(config.server.port);
    }
}

void Main.main();
