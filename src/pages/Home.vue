<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import MarvelController from '../controllers/marvel';
import Comic from '../entities/comic';
import FirebaseController from '../controllers/firebase';
import { Unsubscribe } from '@firebase/util';
import { useRoute, useRouter } from 'vue-router'

const route = useRoute();
const router = useRouter();

const comics = ref<Array<Comic>>([]);

let listenForRatingChangesUnsubscribe: Unsubscribe | undefined;
let removeAfterEachHook: () => void | undefined;

async function ratingChanged(comicId: number, rating: number) {
    await FirebaseController.updateComic(comicId, { rating: rating });
}

async function start() {
    await MarvelController.initPromise;

    comics.value.length = 0;

    const authorName = route.params.authorName as string ?? MarvelController.getAuthors().at(0) ?? '';
    comics.value = MarvelController.getComicsByAuthor(authorName);

    for (const comic of comics.value) {
        listenForRatingChangesUnsubscribe = FirebaseController.listenForRatingChanges(comic.id, (_, rating) => {
            const foundComic = comics.value.find(c => c.id === comic.id);
            if (foundComic == null) {
                return;
            }

            foundComic.rating = rating;
        });
    }
}

function authorClicked(name: string) {
    router.push({ name: 'authors', params: { authorName: name } });
}

onMounted(() => {
    removeAfterEachHook = router.afterEach((navGuard) => {
        if (navGuard.name !== 'authors' && navGuard.name !== 'home') {
            return;
        }

        start();
    });

    start();
});

onUnmounted(() => {
    removeAfterEachHook?.();
    listenForRatingChangesUnsubscribe?.();
});
</script>

<template>
    <v-container>
        <v-item-group selected-class="bg-primary">
            <v-container>
                <v-row>
                    <v-col v-for="comic in comics" :key="comic.id" cols="12" md="4">
                        <v-item>
                            <v-card class="mx-auto my-12" max-width="374" height="100%">
                                <v-img height="250" :src="comic.thumbnailUrl"></v-img>

                                <v-card-item>
                                    <v-card-title class="text-body-1">{{ comic.title }}</v-card-title>

                                    <v-card-subtitle>
                                        <v-sheet class="mx-auto" max-width="600">
                                            <v-slide-group show-arrows>
                                                <v-slide-group-item v-for="creator in comic.creatorNames" :key="creator">
                                                    <v-btn class="ma-2" rounded @click="authorClicked(creator)">
                                                        {{ creator }}
                                                    </v-btn>
                                                </v-slide-group-item>
                                            </v-slide-group>
                                        </v-sheet>
                                    </v-card-subtitle>
                                </v-card-item>

                                <v-card-text>
                                    <v-row align="center" class="mx-0">
                                        <v-rating v-model="comic.rating" color="amber" size="small" hover half-increments
                                            @update:modelValue="ratingChanged(comic.id, comic.rating)"></v-rating>

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

                                    <div class="text-body-1">{{ comic.seriesName }}</div>
                                </v-card-text>
                                <v-divider class="mx-4 mb-1"></v-divider>
                                <v-card-text v-if="comic.comments.length == 0" class="text-body-1 px-4" >
                                    We don't have any comments for this comic, do you want to be the <span><router-link
                                            :to="{ name: 'comments', params: { comicId: comic.id } }">first
                                            one</router-link></span>?
                                </v-card-text>
                                <v-card-text v-else>
                                    <v-card height="100%">
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
                                                    {{ comic.getRandomComment()?.comment }}
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
