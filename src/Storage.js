const path = require("path");

const CSV = require("./CSV");

const {data: config} = require("../config.json");

class Storage {
    static PATHS = {
        SERVICES: path.join(__dirname, "..", config.services_path),
        ENTITIES: path.join(__dirname, "..", config.entities_path)
    }

    static services = {};

    static entities = {};

    static servicesInputs = {};

    static async load() {
        const assignById = rows => Object.fromEntries(
            rows.map(row => ([row.id, row]))
        );

        Storage.services = assignById(await CSV.load(Storage.PATHS.SERVICES));
        Storage.entities = assignById(await CSV.load(Storage.PATHS.ENTITIES));
        Storage.servicesInputs = Object.fromEntries(
            Object.keys(Storage.entities).map(name => ([name, []]))
        );

        const getEntityFilter = service_name => name => {
            if (!name)
                return false;

            if (Storage.entities[name])
                return true;

            console.warn(`Invalid entity in service #${service_name}: ${name}`);
            return false;
        }

        Object.values(Storage.services).forEach(data => {
            const entity_filter = getEntityFilter(data.id)

            data.input = data.input.split(" ").filter(entity_filter);
            data.output = data.output.split(" ").filter(entity_filter);

            data.input.forEach(name => Storage.servicesInputs[name].push(data));
        });

        console.info(
            "Loaded",
            Object.keys(Storage.services).length, "services and",
            Object.keys(Storage.entities).length, "entities"
        );
    }

    static async listEntities() {
        return Storage.entities;
    }

    static async getServiceById(id) {
        return Storage.services[id];
    }

    static async getServicesByIds(ids) {
        return ids.map(id => Storage.services[id]);
    }

    static async getServicesByInputs(inputs) {
        const used = {};

        return inputs
            .map(id => Storage.servicesInputs[id] || [])
            .flat()
            .filter(id => {
                const was_used = used[id];

                used[id] = true;

                return was_used;
            });
    }
}

module.exports = Storage;
