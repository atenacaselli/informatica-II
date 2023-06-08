<script setup lang="ts">
import { ref } from 'vue';
import MarvelController from './controllers/marvel';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter();

const isLoading = ref(true);
const searchText = ref('');
const authors = ref<Array<string>>([]);

function updateModelValue() {
  if (searchText.value === '') {
    return;
  }

  if (searchText.value == null) {
    router.push({ path: '/' })
    return;
  }

  router.push({ name: 'authors', params: { authorName: searchText.value } });
}

onMounted(async () => {
  isLoading.value = true;

  MarvelController.initPromise = MarvelController.init();
  await MarvelController.initPromise;

  authors.value.push(...MarvelController.getAuthors());

  isLoading.value = false;
});

</script>

<template>
  <v-app>
    <v-overlay :model-value="isLoading" class="align-center justify-center">
      <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-app-bar>
      <v-app-bar-title>Marvel Comics</v-app-bar-title>
      <v-spacer />
      <v-autocomplete label="Authors" class="mx-4" prepend-inner-icon="mdi-magnify" clearable solo hide-details
        single-line :items="authors" v-model="searchText" @update:modelValue="updateModelValue()"></v-autocomplete>
    </v-app-bar>

    <v-main>
      <RouterView></RouterView>
    </v-main>
  </v-app>
</template>
