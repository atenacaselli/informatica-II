<script setup lang="ts">
import { ref } from 'vue';
import Comic from '../entities/comic.js';
import { onMounted } from 'vue';
import MarvelController from '../controllers/marvel';
import FirebaseController from '../controllers/firebase';

const loading = ref(false);

const comics = ref<Array<Comic>>([]);

onMounted(async () => {
    // for (const comic of comics.value) {
    //     await comic.getFirestoreData();
    // }

    comics.value = await MarvelController.getComicsByAuthor('Jim Nausedas');
    FirebaseController.getComments();
});
</script>

<template>
    <v-container>
        <v-item-group selected-class="bg-primary">
            <v-container>
                <v-row>
                    <v-col v-for="comic in comics" :key="comic.title" cols="12" md="4">
                        <v-item>
                            <v-card :loading="loading" class="mx-auto my-12" max-width="374">
                                <template v-slot:loader="{ isActive }">
                                    <v-progress-linear :active="isActive" color="deep-purple" height="4"
                                        indeterminate></v-progress-linear>
                                </template>

                                <v-img height="250" :src="comic.thumbnail"></v-img>

                                <v-card-item>
                                    <v-card-title>{{ comic.title }}</v-card-title>

                                    <v-card-subtitle>
                                        <v-sheet class="mx-auto" max-width="600">
                                            <v-slide-group show-arrows>
                                                <v-slide-group-item v-for="creator in comic.creatorNames" :key="creator"
                                                    v-slot="{ toggle }">
                                                    <v-btn class="ma-2" rounded @click="toggle">
                                                        {{ creator }}
                                                    </v-btn>
                                                </v-slide-group-item>
                                            </v-slide-group>
                                        </v-sheet>
                                    </v-card-subtitle>
                                </v-card-item>

                                <v-card-text>
                                    <v-row align="center" class="mx-0">
                                        <v-rating v-model="comic.rating" color="amber" size="small" hover
                                            half-increments></v-rating>

                                        <div class="text-grey ms-4">
                                            {{ comic.rating }}
                                        </div>
                                    </v-row>

                                    <div class="my-4 text-subtitle-1">
                                        {{ new Intl.NumberFormat('it-IT', {
                                            style: 'currency', currency:
                                                'USD',
                                            currencyDisplay: 'narrowSymbol',
                                        }).format(comic.price!) }}
                                    </div>

                                    <div>{{ comic.seriesName }}</div>

                                </v-card-text>
                                <v-divider class="mx-4 mb-1"></v-divider>

                                <v-card-text v-if="comic.comments.length == 0" class="px-4">
                                    We don't have any comments for this comic, do you want to be the <span><a
                                            href="https://www.w3schools.com">first one</a></span>?
                                </v-card-text>
                                <v-card-text v-else>
                                    <v-card>
                                        <template v-slot:prepend>
                                            <v-avatar color="info">
                                                <v-icon icon="mdi-account-circle"></v-icon>
                                            </v-avatar>
                                        </template>
                                        <template v-slot:title>
                                            Anon user
                                        </template>

                                        <v-card-text>
                                            <v-row>
                                                <v-col cols="8">
                                                    {{ comic.getRandomComment() }}
                                                </v-col>
                                                <v-col cols="4">
                                                    <router-link :to="{ name: 'comments', params: { comicId: comic.id } }">
                                                        Add new comment
                                                    </router-link>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                </v-card-text>
                            </v-card>
                        </v-item>
                    </v-col>
                </v-row>
            </v-container>
        </v-item-group>
    </v-container>
</template>

<style scoped>
a {
    text-decoration: none;
    color: black;
}

a:hover {
    color: gray;
}
</style>
