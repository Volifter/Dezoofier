export default class TagInput {
    constructor($root, limit = 10) {
        this.$root = $root;
        this.$ = {
            tags:        $root.querySelector(".tags"),
            suggestions: $root.querySelector(".suggestions"),
            input:       $root.querySelector("input"),
        };
        this.limit        = limit;
        this.options      = [];
        this.optionNames  = {};
        this.$suggestions = [];
        this.$suggested   = [];
        this.pickedTags   = {};
        this.selectedIdx  = -1;

        this.$.tags.addEventListener("click", e => {
            if (e.target == this.$.tags)
                this.$.input.focus();
        });

        this.$.input.addEventListener("input", e => {
            e.target.size = Math.max(1, e.target.value.length * 2);

            this.autocomplete(e.target.value);
        });
        this.$.input.addEventListener("focus", e => {
            this.$root.classList.add("focused");
            this.autocomplete(e.target.value);
        });
        this.$.input.addEventListener("blur", e => {
            if (e.relatedTarget?.parentNode === this.$.suggestions)
                return;

            this.$root.classList.remove("focused");
            this.selectedIdx = -1;
            this.autocomplete("");
        });

        this.$.input.addEventListener("keydown", e => {
            if (e.key == "Enter") {
                if (this.pickTag())
                    e.preventDefault();
                return;
            }
            if (e.key == "Backspace" && !this.$.input.value) {
                e.preventDefault();
                return this.removeLastTag();
            }
            if (e.key == "ArrowUp") {
                e.preventDefault();
                return this.selectTag(-1);
            }
            if (e.key == "ArrowDown") {
                e.preventDefault();
                return this.selectTag(1);
            }
        });
    }

    get selectedTags() {
        return Object.keys(this.pickedTags);
    }

    setOptions(options) {
        this.options = options.map(
            ({id, name, description}) => ({
                id,
                name,
                description,
                content: (name + " " + description).toLocaleLowerCase()
            })
        );

        this.optionNames = Object.fromEntries(options.map(
            ({id, name}) => ([id, name])
        ));

        this.$suggestions = options.map(({id, name, description}) => {
            const el = document.createElement("li");
            const title = document.createElement("span");
            const subtitle = document.createTextNode(` - ${description}`);

            title.innerText = name;

            el.append(title);
            el.append(subtitle);

            this.$.suggestions.append(el);

            el.addEventListener("click", () => this.pickTag(id));
            el.setAttribute("tabindex", "9999");

            return {id, element: el};
        });
    }

    autocomplete(prefix) {
        const normalized = prefix.toLocaleLowerCase();
        const ids = Object.fromEntries(this.options.map(({id, content}) => [
            id,
            !this.pickedTags[id] && content.includes(normalized)
        ]));
        const is_suggested = prefix && Object.values(ids).some(Boolean);

        if (!is_suggested)
            this.selectedIdx = -1;

        this.$root.classList.toggle("suggested", is_suggested);

        let count = 0;

        this.$suggested = this.$suggestions.filter(({id, element}) => {
            const is_shown = !!ids[id] && count++ < this.limit;

            element.classList.toggle("shown", is_shown);

            return is_shown;
        });
    }

    selectTag(delta) {
        if (!this.$suggested.length)
            return;

        const size = this.$suggested.length;

        this.$root.querySelector(
            ".suggestions li.selected"
        )?.classList?.remove("selected");

        this.selectedIdx = this.selectedIdx == -1
            ? (delta == 1 ? 0 : size - 1)
            : (size + this.selectedIdx + delta) % size;

        this.$suggested[this.selectedIdx].element.classList.add("selected");
    }

    pickTag(id) {
        if (!this.$suggested.length || !id && this.selectedIdx == -1)
            return false;

        id = id || this.$suggested[this.selectedIdx].id;

        this.$.input.value = "";
        this.autocomplete("");

        this.pickedTags[id] = true;

        const el = document.createElement("div");

        el.innerText = this.optionNames[id];

        el.__id = id;
        el.addEventListener("click", () => {
            delete this.pickedTags[id];
            el.remove();
            this.$.input.focus();
        });

        this.$.tags.insertBefore(el, this.$.input);
        this.$.input.focus();

        return true;
    }

    removeLastTag() {
        const children = [...this.$.tags.children];

        if (children.length < 2)
            return;

        const el = children.slice(-2)[0];
        const id = el.__id;

        delete this.pickedTags[id];
        el.remove();
    }
}
