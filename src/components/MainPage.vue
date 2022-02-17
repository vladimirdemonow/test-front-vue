<template>
  <v-row>
    <v-col cols="6">
      <v-data-table
        :headers="headers"
        :items="clientListMapped"
        :page="page"
        :items-per-page="limit"
        :server-items-length="totalNum"
        @pagination="onUpdatePagination"
        @click:row="onRowClick"
      />
    </v-col>
    <v-col cols="3">
      <ClientCard
        :clientOne="clientOne"
        :clientList="clientList"
        :providers="providers"
        @createClient="onCreateClient"
        @updateClient="onUpdateClient"
        @deleteClient="onDeleteClient"
      />
    </v-col>
    <v-col cols="3">
      <ProviderCard
        :providers="providers"
        @createProvider="onCreateProvider"
        @deleteProvider="onDeleteProvider"
        @updateProvider="onUpdateProvider"
      />
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios';

import ClientCard from '@/components/ClientCard.vue';
import ProviderCard from '@/components/ProviderCard.vue';

import {
  createProvider,
  deleteProvider,
  readProviders,
  updateProvider,
} from '../config/axiosConfigProviders';
import { readClients } from '../config/axiosConfigsClients';

export default {
  name: 'ClientList',
  components: {
    ClientCard,
    ProviderCard,
  },
  async beforeMount() {
    try {
      this.readCurrentPage();
      this.readProviders();
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      limit: 5,
      page: 1,
      totalNum: 0,
      clientOne: {},
      clientList: [],
      providers: [],
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Email',
          value: 'email',
        },
        {
          text: 'Phone',
          value: 'phone',
        },
        {
          text: 'Providers',
          value: 'providers',
        },
      ],
    };
  },
  computed: {
    clientListMapped: function () {
      return this.clientList.map(({ name, email, phone, providers }) => ({
        name,
        email,
        phone,
        providers: providers.map((provider) => provider.name),
      }));
    },
  },
  methods: {
    // * Core methods
    onRowClick(selectedClient) {
      this.clientOne = this.clientList.find((client) => selectedClient.email === client.email);
    },
    async onUpdatePagination(pagination) {
      try {
        if (pagination.pageCount < 1) return;
        this.limit = pagination.itemsPerPage;
        this.page = pagination.page;
        this.readCurrentPage();
      } catch (error) {
        console.log(error);
      }
    },

    // * Clients methods
    onCreateClient() {
      this.readCurrentPage();
    },
    async readCurrentPage() {
      try {
        const clientsResponse = await axios(readClients(this.limit, this.page).options);
        this.clientList = clientsResponse.data.clients;
        this.totalNum = clientsResponse.data.total_num;
      } catch (error) {
        console.log(error);
      }
    },
    onUpdateClient(client) {
      this.readCurrentPage();
      this.clientOne.providers = client.providers.map((name) =>
        this.providers.find((provider) => provider.name === name)
      );
    },
    onDeleteClient() {
      this.readCurrentPage(true);
      this.clientOne = {};
    },

    // * Providers methods
    async onCreateProvider(name) {
      try {
        await axios(createProvider(name).options);
      } catch (error) {
        this.$notify({
          type: error,
          text: 'Server error',
        });
      }
      this.readProviders();
    },
    async readProviders() {
      try {
        const providersResponse = await axios(readProviders().options);
        this.providers = providersResponse.data;
      } catch (error) {
        this.$notify({
          type: error,
          text: 'Server error',
        });
      }
    },
    async onUpdateProvider(provider) {
      try {
        await axios(updateProvider(provider.name, provider._id).options);
      } catch (error) {
        this.$notify({
          type: error,
          text: 'Server error',
        });
      }
      this.readProviders();
      this.readCurrentPage();
    },
    async onDeleteProvider(provider) {
      try {
        if (Object.keys(this.clientOne).length) {
          this.clientOne.providers = this.clientOne.providers.filter(
            (item) => item._id !== provider._id
          );
        }
        await axios(deleteProvider(provider._id).options);
      } catch (error) {
        this.$notify({
          type: error,
          text: error.message,
        });
      }
      this.readProviders();
      this.readCurrentPage();
    },
  },
};
</script>
