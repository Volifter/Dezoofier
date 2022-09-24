const fs = require("fs");
const csvParse = require("csv-parse");

class CSV {
    static async load(filepath) {
        const data = await fs.promises.readFile(filepath);
        const rows = await new Promise((resolve, reject) => {
            csvParse.parse(
                data,
                (error, records) => error ? reject(error) : resolve(records)
            );
        });

        if (rows.length < 1)
            throw new Error(`csv file ${filepath} is empty`);

        return rows.slice(1).map((row, i) => {
            if (row.length != rows[0].length)
                throw new Error(
                    `${filepath}: row #${i + 1} has invalid length`
                );

            return Object.fromEntries(rows[0].map(
                (title, i) => [title, isNaN(row[i] || "_") ? row[i] : +row[i]]
            ));
        });
    }
}

module.exports = CSV;
