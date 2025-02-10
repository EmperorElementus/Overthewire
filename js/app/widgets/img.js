export var img = {
    data: function () {
      return {
        value: ""
      };
    },
    mounted() {
      this.value = this.modelValue;
    },
    methods: {
      change(event) {
        var self = this;
        var file = event.target.files[0];
        if (file) {
          var reader = new FileReader();
          reader.onload = function () {
            self.value = reader.result;
            self.$emit("update:modelValue", reader.result);
          };
          reader.readAsDataURL(file);
        }
      }
    },
    props: {
      modelValue: String
    },
    template: `
      <div class="image-preview-area">
        <a href="#" class="select_img" @click.prevent="$refs.input.click()">
          <span v-if="value" class="im">
            <img :src="value" alt="Selected Image" style="max-width: 100px; max-height: 100px;">
          </span>
          <span v-else>
            <img src="/app/views/images/placeholder.png" alt="Placeholder">
          </span>
        </a>
        </div>
        <div>
        <input type="file" ref="input" accept="image/jpeg, image/png, image/gif, image/webp, image/svg+xml" 
         @change="change" style="border: none; outline: none; padding: 5px 0px 0px 0px; width: auto; background: none; cursor: pointer;">
      </div>
    `
  };
  