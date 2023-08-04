<template>
  <multiselect
    :class="['multiselect-dropdown', 'mb-3']"
    :options="options"
    label="name"
    placeholder="Wybierz region"
    @search-change="getOptions"
    :loading="loading"
    :hide-selected="true"
  ></multiselect>
</template>
<script>
import Multiselect from "vue-multiselect";
import axios from "axios";

export default {
  name: "MultiselectComponent",
  props: {
    url: String,
    optionsStatic: Array,
  },
  components: { Multiselect },
  data() {
    return {
      loading: false,
      option: "",
      options: [],
    };
  },
  methods: {
    async getOptions(val = "") {
      if (this.url) {
        const { data } = await axios.get(this.url + (val ? "?q=" + val : ""));
        this.options = data.data;
      } else {
        this.options = this.optionsStatic;
      }
    },
  },
};
</script>
<style>
.multiselect-dropdown {
  background: #f6f6f6;
  border-bottom: 1px #a5a5a5 solid;
  padding: 15px;
  text-align: left;
  position: relative;
}
.multiselect-dropdown input {
  outline: none;
  cursor: auto;
}
.multiselect__content {
  padding: 0;
  width: 100%;
}
.multiselect__content li {
  list-style-type: none;
  margin: 0;
}
.multiselect__content li .multiselect__option {
  background: #f6f6f6;
  padding: 15px;
  text-align: left;
  display: block;
}
.multiselect__content li .multiselect__option:hover {
  background-color: #8080804a;
  cursor: pointer;
  transition: 0.2s background-color ease-out;
}
.multiselect__content .multiselect__element .multiselect__option--highlight {
  background: gray;
}
.multiselect__content-wrapper {
  border: 1px solid;
  padding: 0;
  margin: 0;
  position: absolute;
  width: 100%;
  left: 0;
  box-shadow: 0 0 5px black;
  background: #f6f6f6;
  z-index: 1;
  top: 100%;
  margin-top: 5px;
}
.multiselect__content-wrapper ul {
  margin-bottom: 0;
}
.multiselect__content-wrapper ul li {
  border-bottom: 1px solid #8080804a;
}
</style>
