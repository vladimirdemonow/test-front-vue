<template>
  <v-card>
    <v-card-title dense class="light-blue lighten-5">Client</v-card-title>
    <v-text-field
      dense
      class="px-5 mt-7"
      :rules="[rules.required]"
      v-model="clientInput.name"
      label="Enter name"
      outlined
    />
    <v-text-field
      dense
      class="px-5"
      v-model="clientInput.email"
      :rules="[rules.required, rules.email]"
      label="Enter email"
      outlined
    />
    <v-text-field
      dense
      class="px-5"
      v-model="clientInput.phone"
      :rules="[rules.required, rules.number, rules.numberLength]"
      label="Enter phone"
      outlined
    />
    <v-combobox
      class="px-5 py-0"
      :items="mappedProviders"
      label="Chose Providers"
      multiple
      outlined
      dense
      v-model="clientInput.providers"
    ></v-combobox>
    <v-divider />
    <v-sheet class="d-flex justify-center">
      <v-btn class="ml-3 my-3 px-15" @click="acceptForm">Save</v-btn>
    </v-sheet>
  </v-card>
</template>

<script>
import axios from 'axios';
import { createClient, updateClient } from '../config/axiosConfigsClients';

export default {
  name: 'ClientDialog',
  props: {
    clientOne: {
      type: Object,
      default: () => {},
    },
    clientList: {
      type: Array,
      default: () => [],
    },
    providers: {
      type: Array,
      default: () => [],
    },
  },
  beforeMount() {
    if (this.clientOne?.name) {
      const { created_at, updated_at, _id, ...info } = this.clientOne;
      this.clientInput = { providers: this.clientOne.providers, ...info };
    }
    this.clientInput.providers = this.clientInput.providers.map((element) => element.name);
    this.mappedProviders = this.providers.map((item) => item.name);
  },
  beforeDestroy() {
    this.$emit('dialogDestroy', false);
  },
  data() {
    return {
      clientInput: {
        name: '',
        email: '',
        phone: '',
        providers: [],
      },
      rules: {
        required: (value) => !!value || 'Required.',
        number: (value) => !isNaN(+value) || 'Must contains only numbers',
        numberLength: (value) => value.length === 10 || 'Must contains 10 characters',
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || 'Invalid e-mail.';
        },
      },
    };
  },
  methods: {
    async acceptForm() {
      const { providers: unmapedProvidersID, ...info } = this.clientInput;
      const currentProviders = unmapedProvidersID.map(
        (name) => this.providers.find((provider) => provider.name === name)._id
      );

      // * Create client
      if (!Object.keys(this.clientOne).length) {
        const config = createClient({ ...info, providers: currentProviders });
        const response = await axios(config.options);
        if (response.status === 208) {
          return this.$notify(config.alreadyExist);
        }
        this.$emit('createClient', this.clientInput);
        this.$notify(config.success);
      } else {
        // * Update client
        const config = updateClient({
          providers: currentProviders,
          _id: this.clientOne._id,
          ...info,
        });
        const response = await axios(config.options);
        if (response.status === 208) {
          return this.$notify(config.alreadyExist);
        }
        this.$emit('updateClient', this.clientInput);
        this.$notify(config.success);
      }

      this.isUpdate = false;
      this.client = {};
    },
  },
};
</script>
