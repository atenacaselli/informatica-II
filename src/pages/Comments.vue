<script setup lang="ts">
import { onMounted, ref } from 'vue';
// import { useRoute } from 'vue-router'

// const route = useRoute();
const showCommentPublishError = ref(false);
const items = ref([
    {
        btnSelected: undefined,
    },
    {
        btnSelected: 0,
    },
    {
        btnSelected: 1
    },
    {
        btnSelected: undefined
    },
]);

onMounted(() => {
    // console.log(route.params.comicId);
});
</script>

<template>
    <v-row style="height: 100vh;">
        <v-col cols="2">
            <v-img height="100%" cover src="http://i.annihil.us/u/prod/marvel/i/mg/f/c0/4bc66d78f1bee.jpg"></v-img>
        </v-col>
        <v-col cols="10">
            <v-container>
                <v-row>
                    <v-col cols="12">
                        <v-row>
                            <v-col cols="12">
                                <v-textarea prepend-inner-icon="mdi-account-circle" counter label="Comment"></v-textarea>
                            </v-col>
                            <v-col cols="12" class="text-right">
                                <v-btn>Submit</v-btn>
                            </v-col>
                            <v-col cols="12">
                                <v-alert v-model="showCommentPublishError" closable text="Something went wrong. Try later!" type="error"
                                    variant="outlined"></v-alert>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="12">
                        <v-timeline side="end" align="start">
                            <v-timeline-item v-for="(comment, i) in items" :key="i" dot-color="grey-lighten-1"
                                icon="mdi-account-circle" fill-dot>
                                <v-card>
                                    <v-card-title class="text-h6 bg-grey-lighten-1">
                                        Lorem Ipsum Dolor
                                    </v-card-title>
                                    <v-card-text class="bg-white text--primary">
                                        <p>Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet
                                            nec ut, sed euismod convenire principes at. Est et nobis iisque percipit, an vim
                                            zril disputando voluptatibus, vix an salutandi sententiae.</p>

                                        <v-btn-toggle v-slot="{ isSelected }" color="primary" variant="plain"
                                            v-model="comment.btnSelected">
                                            <v-btn :color="!isSelected(0) ? 'red-lighten-1' : ''" :ripple="false">
                                                <v-icon>mdi-heart</v-icon>
                                            </v-btn>

                                            <v-btn :color="!isSelected(0) ? 'blue-lighten-1' : ''" :ripple="false">
                                                <v-icon>mdi-thumb-down</v-icon>
                                            </v-btn>
                                        </v-btn-toggle>
                                    </v-card-text>
                                </v-card>
                            </v-timeline-item>
                        </v-timeline>
                    </v-col>
                </v-row>
            </v-container>
        </v-col>
    </v-row>
</template>