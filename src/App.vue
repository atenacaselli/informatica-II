<script setup lang="ts">
</script>

<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title>Marvel Comics</v-app-bar-title>
      <v-spacer />
      <v-autocomplete clearable label="Authors"
        :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']" variant="solo"></v-autocomplete>
    </v-app-bar>

    <v-main>
      <RouterView></RouterView>
    </v-main>
  </v-app>
</template>

<style scoped></style>
