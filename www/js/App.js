import Api from "./Api.js";
import TagInput from "./TagInput.js";
import ServiceElement from "./ServiceElement.js";

class App {
    constructor() {
        this.$ = {
            fromTagInput:    document.querySelector(".from-tag-input"),
            toTagInput:      document.querySelector(".to-tag-input"),
            form:            document.querySelector("form"),
            searchButton:    document.querySelector(".search-button"),
            directResults:   document.querySelector(".direct-results"),
            services:        document.querySelector(".services"),
            indirectResults: document.querySelector(".indirect-results"),
            paths:           document.querySelector(".paths"),
            serviceTemplate: document.getElementById("service-template")
        };
        this.entities  = {};
        this.fromInput = new TagInput(this.$.fromTagInput);
        this.toInput   = new TagInput(this.$.toTagInput);

        void this.init();

        this.$.form.addEventListener("submit", async e => {
            e.preventDefault();

            const from_tags = this.fromInput.selectedTags;
            const to_tags = this.toInput.selectedTags;

            if (!from_tags.length)
                return alert("Please choose at least one known entity");

            this.$.searchButton.disabled = true;

            try {
                const paths = await Api.getPaths({
                    from: from_tags.join(),
                    to:   to_tags.join()
                });

                this.setPaths(paths, from_tags, to_tags);
            } finally {
                this.$.searchButton.disabled = false;
            }
        });
    }

    async init() {
        const entities = await Api.listEntities();

        this.fromInput.setOptions(entities);
        this.toInput.setOptions(entities);

        this.entities = Object.fromEntries(
            entities.map(data => ([data.id, data]))
        );
    }

    setPaths(paths, input_entities, output_entities) {
        let has_direct   = false;
        let has_indirect = false;

        this.$.services.innerHTML = "";
        this.$.paths.innerHTML    = "";

        paths.forEach(path => {
            if (path.length == 1) {
                has_direct = true;

                return new ServiceElement(
                    this.$.serviceTemplate,
                    path[0],
                    this.entities,
                    input_entities,
                    output_entities
                ).appendTo(this.$.services);
            }

            has_indirect = true;

            const $path = document.createElement("div");

            $path.classList.add("path");

            path.forEach((service, i) => {
                new ServiceElement(
                    this.$.serviceTemplate,
                    service,
                    this.entities,
                    path[i - 1]?.output || input_entities,
                    path[i + 1]?.input || output_entities
                ).appendTo($path);

                const next = path[i + 1]

                if (!next)
                    return;

                const $ul = document.createElement("ul");
                const common = service.output.filter(
                    id => next.input.includes(id)
                );

                common.forEach(id => {
                    const $li = document.createElement("li");

                    $li.innerText = this.entities[id].name;

                    $ul.append($li);
                });

                $path.append($ul);
            });

            this.$.paths.append($path);
        });

        this.$.directResults.classList.toggle("shown", has_direct);
        this.$.indirectResults.classList.toggle("shown", has_indirect);
    }
}

window.app = new App();
