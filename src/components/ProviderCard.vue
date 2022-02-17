<template>
  <v-card elevation="2">
    <v-card-title class="light-blue lighten-5 mb-2">Providers </v-card-title>

    <v-list-item v-for="(value, key) in providers" :key="key">
      <v-list-item-content v-if="currentProvider !== value.name">
        {{ value.name }}
      </v-list-item-content>
      <v-text-field
        autofocus
        v-else
        v-model="updatedProvider.name"
        @blur="textFieldOnBlur"
        @keyup.enter="onEnterTextField"
      />
      <v-spacer />
      <v-btn
        @click="editProvider(value)"
        class="mx-2"
        fab
        dark
        small
        color="primary"
        :disabled="currentProvider === value.name"
      >
        <v-icon dark> mdi-pen </v-icon>
      </v-btn>
      <v-btn @click="deleteProvider(value)" class="mx-2" fab dark small color="primary">
        <v-icon dark> mdi-trash-can </v-icon>
      </v-btn>
    </v-list-item>
    <v-divider class="mt-5" />
    <v-sheet class="d-flex justify-space-beetwen mt-5 pa-2 pb-0">
      <v-text-field
        dense
        class="px-5"
        label="Create provider"
        outlined
        clearable
        v-model="createdProvider"
      />
      <v-btn class="mr-5" @click="createProvider">create</v-btn>
    </v-sheet>
  </v-card>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      createdProvider: '',
      currentProvider: '',
      updatedProvider: { name: '', _id: '' },
    };
  },

  props: {
    providers: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    createProvider() {
      if (!this.createdProvider) return;
      const isAlreadyExistProvider = this.providers.find(
        (provider) => provider.name === this.createdProvider
      );
      if (isAlreadyExistProvider) {
        this.$notify({
          type: 'warn',
          title: 'Provider is already exist',
        });
        return;
      }

      this.$emit('createProvider', this.createdProvider);
      this.createdProvider = '';
    },
    deleteProvider(provider) {
      this.$emit('deleteProvider', provider);
    },
    textFieldOnBlur() {
      this.currentProvider = '';
      this.updatedProvider.name = '';
    },
    onEnterTextField(event) {
      this.updatedProvider.name = event.target.value;
      this.$emit('updateProvider', { ...this.updatedProvider });
      this.currentProvider = '';
      this.updatedProvider.name = '';
      this.updatedProvider._id = '';
    },
    editProvider({ name, _id }) {
      this.currentProvider = name;
      this.updatedProvider.name = name;
      this.updatedProvider._id = _id;
    },
  },
};
</script>
