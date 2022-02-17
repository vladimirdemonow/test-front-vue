<template>
  <v-card elevation="2">
    <v-card-title class="light-blue lighten-5">
      Client
      <v-spacer />
      <v-btn class="elevation-1" small @click="createNewClient">create</v-btn>
    </v-card-title>
    <v-sheet v-if="Object.keys(clientOne).length" class="pt-4">
      <v-list-item v-for="(value, key) in clientOneMapped" :key="key" class="pa-0 ma-0 mb-2">
        <v-list-item-content>
          <v-card-text class="text--secondary ma-0 px-5 py-0"> {{ key }} </v-card-text>
          <v-card-text v-if="key !== 'providers'" class="text--primary mt-3 px-5 py-0 mx-1">
            {{ value }}
          </v-card-text>
          <v-combobox
            v-else
            readonly
            v-model="clientOneMapped.providers"
            outlined
            dense
            class="mx-5 pt-1"
            hide-details="true"
          />
        </v-list-item-content>
      </v-list-item>
      <v-divider class="mt-5" />
      <v-sheet class="pa-5 d-flex justify-space-between">
        <v-btn @click="editClient">edit</v-btn>
        <v-btn @click="onDeleteClient">delete</v-btn>
      </v-sheet>
    </v-sheet>
    <v-sheet v-else>
      <v-card>
        <v-card-text>Please, select client</v-card-text>
      </v-card></v-sheet
    >
    <v-dialog v-model="isDialog" max-width="450">
      <ClientDialog
        v-if="isDialog"
        :clientOne="isEdit ? clientOne : {}"
        :clientList="clientList"
        :providers="providers"
        @createClient="onCreateClient"
        @updateClient="onUpdateClient"
        @dialogDestroy="onDialogDestroy"
      />
    </v-dialog>
  </v-card>
</template>

<script>
import axios from 'axios';

import ClientDialog from './ClientDialog.vue';

import { deleteClient } from '../config/axiosConfigsClients';

export default {
  name: 'ClientCard',

  components: {
    ClientDialog,
  },

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

  computed: {
    clientOneMapped: function () {
      const { name, email, phone, providers } = this.clientOne;
      const mappedProviders = providers.map((provider) => provider.name);
      return { name, email, phone, providers: mappedProviders };
    },
  },

  data() {
    return {
      isDialog: false,
      isEdit: false,
    };
  },

  methods: {
    createNewClient() {
      this.isDialog = true;
    },
    editClient() {
      this.isDialog = true;
      this.isEdit = true;
    },
    onCreateClient(client) {
      this.isDialog = false;
      this.isEdit = false;
      this.$emit('createClient', client);
    },
    async onDeleteClient() {
      try {
        const config = deleteClient(this.clientOne._id);
        await axios(config.options);
        this.$notify(config.success);
        this.$emit('deleteClient', this.clientOne);
      } catch (error) {
        this.$notify({
          type: error,
          text: 'Server error',
        });
      }
    },
    onUpdateClient(client) {
      this.isDialog = false;
      this.isEdit = false;
      this.$emit('updateClient', client);
    },
    onDialogDestroy() {
      this.isEdit = false;
    },
  },
};
</script>
