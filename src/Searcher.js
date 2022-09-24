const Storage = require("./Storage");

class Searcher {
    static SIMPLE_LIMIT = 16;

    static FULL_LIMIT = 32;

    static async searchSingle(inputs) {
        return (await Storage.getServicesByInputs(inputs))
            .sort((a, b) => b.score - a.score)
            .map(service => [service])
            .slice(0, Searcher.SIMPLE_LIMIT);
    }

    static async searchMultiple(inputs, outputs, max_depth = 3) {
        const used_ids = {};
        const results = [];
        const outputs_obj = Object.fromEntries(
            outputs.map(val => ([val, true]))
        );
        let stack = [{path: [], outputs: inputs.slice(), score: 0}];

        for (let depth = 0; stack.length && depth < max_depth; depth++) {
            const new_stack = [];

            for (let {path, outputs, score} of stack) {
                const services = (await Storage.getServicesByInputs(outputs))
                    .filter(service => {
                        const was_present = used_ids[service.id];

                        used_ids[service.id] = true;

                        return !was_present;
                    })
                    .sort((a, b) => b.score - a.score);

                new_stack.push(...services.map(service => ({
                    path:    [...path, service],
                    outputs: service.output,
                    score:   score + +service.score
                })));
            }

            new_stack.sort((a, b) => b.score - a.score);

            for (const {path, outputs} of new_stack) {
                if (
                    (depth || results.length < Searcher.SIMPLE_LIMIT)
                    && outputs.some(id => outputs_obj[id])
                ) {
                    results.push(path);

                    if (results.length == Searcher.FULL_LIMIT)
                        return results;
                }
            }

            stack = new_stack;
        }

        return results;
    }

    static async getPaths(from, to) {
        return to.length
            ? await Searcher.searchMultiple(from, to)
            : await Searcher.searchSingle(from);
    }
}

module.exports = Searcher;
