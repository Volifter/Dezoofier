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
        };

        this.$root.setAttribute("href", data.url);
        this.$root.classList.add(data.category);

        this.$.title.innerText = data.name;

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

    appendTo($parent) {
        $parent.append(this.$root);
    }
}
