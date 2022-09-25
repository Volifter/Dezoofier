export default class ServiceElement {
    constructor(
        $template,
        data,
        entities,
        previous_entities = [],
        next_entities = []
    ) {
        this.$root = $template.content.children[0].cloneNode(true);
        this.$ = {
            title:          this.$root.querySelector("h2"),
            inputEntities:  this.$root.querySelector(".input-entities"),
            outputEntities: this.$root.querySelector(".output-entities"),
            labels:         this.$root.querySelector(".labels"),
        };

        this.$root.setAttribute("href", data.url);
        this.$root.classList.add(data.category);

        this.$.title.innerText = data.name;

        this.setEntities(data, entities, previous_entities, next_entities);
        this.setLabels(data);
    }

    setEntities(data, entities, previous_entities, next_entities) {
        const addLi = ($parent, text, is_active) => {
            const $li = document.createElement("li");

            $li.innerText = text;

            if (is_active)
                $li.classList.add("active");

            $parent.append($li);
        }

        data.input.forEach(id => addLi(
            this.$.inputEntities,
            entities[id].name,
            previous_entities.includes(id)
        ));
        data.output.forEach(id => addLi(
            this.$.outputEntities,
            entities[id].name,
            next_entities.includes(id)
        ));
    }

    setLabels(data) {
        const addLabel = (text, class_name) => {
            const $div = document.createElement("div");
            const $span = document.createElement("span");

            $span.innerText = text;
            $div.classList.add(class_name)

            $div.append($span);
            this.$.labels.append($div);
        }

        if (data.cost == "paid")
            addLabel("Paid", "label-paid");
        if (data.cost == "partially_free")
            addLabel("Partially free", "label-partially-free");
        if (data.score == 1)
            addLabel("Bellingcat's pick", "label-recommended");
        if (data.score < 1 / 3)
            addLabel("Low reputation", "label-low-reputation");
    }

    appendTo($parent) {
        $parent.append(this.$root);
    }
}
