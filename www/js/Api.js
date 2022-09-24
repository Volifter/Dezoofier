export default class Api {
    static BASE_URL = "/api/";

    static async request(path, method = "GET", data = null) {
        const options = {method};

        if (data) {
            if (method == "GET")
                path += "?" + Object.entries(data).map(
                    pair => pair.map(encodeURIComponent).join("=")
                ).join("&");
            else
                options.body = JSON.stringify(data);
        }

        return fetch(Api.BASE_URL + path, options).then(res => res.json());
    }

    static listEntities() {
        return Api.request("entities");
    }

    static getPaths(data) {
        return Api.request("paths", "GET", data);
    }
}
