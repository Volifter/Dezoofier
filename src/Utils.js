class Utils {
    static removeDuplicates(arr) {
        return Object.keys(Object.fromEntries(arr.map(val => [val, null])));
    }
}

module.exports = Utils;
