<script setup lang="ts">
</script>

<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title>Marvel Comics</v-app-bar-title>
      <v-spacer />
      <v-autocomplete label="Authors" class="mx-4" prepend-inner-icon="mdi-magnify" clearable solo hide-details single-line
        :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"></v-autocomplete>
    </v-app-bar>

    <v-main>
      <RouterView></RouterView>
    </v-main>
  </v-app>
</template>
