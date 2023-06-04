<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import FirebaseController, { ComicComment } from '../controllers/firebase';
import { useRoute } from 'vue-router'
import { Unsubscribe } from '@firebase/util';

type ComicCommentWithBtnSelected = ComicComment & {
    btnSelected?: number;
};
type LikeButtonSelected = 0 | 1 | undefined;

const route = useRoute();
const showCommentPublishError = ref(false);
const comments = ref<Array<ComicCommentWithBtnSelected>>([]);
const commentText = ref('');
const commentTitle = ref('');
const isSubmitting = ref(false);

let listenForCommentsChangesUnsubscribe: Unsubscribe | undefined;

function getBtnSelected(comment: ComicComment): LikeButtonSelected {
    if (comment.isLiked) {
        return 0;
    }
    if (comment.isDisliked) {
        return 1;
    }

    return undefined;
}

async function addCommentBtnClicked() {
    if (commentText.value === '' || commentTitle.value === '') {
        return;
    }

    isSubmitting.value = true;

    await FirebaseController.addCommentTo(+route.params.comicId, commentTitle.value, commentText.value);
    commentTitle.value = '';
    commentText.value = '';

    isSubmitting.value = false;
}

async function btnToggleChanged(commentId: string, newStatus: LikeButtonSelected) {
    await FirebaseController.updateComment(+route.params.comicId, commentId, {
        isLiked: newStatus === 0,
        isDisliked: newStatus === 1,
    });
}

onMounted(async () => {
    if (!route.params.comicId || Array.isArray(route.params.comicId)) {
        // redirect to home
        return;
    }

    const comicComments = await FirebaseController.getCommentsFor(+route.params.comicId);
    comments.value = comicComments.map((comment) => {
        return {
            ...comment,
            btnSelected: getBtnSelected(comment),
        };
    });

    listenForCommentsChangesUnsubscribe = FirebaseController.listenForCommentsChanges(+route.params.comicId, (comment, changeType) => {
        if (changeType === 'added') {
            comments.value.unshift(comment);
        } else if (changeType === 'modified') {
            const foundComment = comments.value.find(c => c.id === comment.id);
            if (foundComment == null) {
                return;
            }

            foundComment.isLiked = comment.isLiked;
            foundComment.isDisliked = comment.isDisliked;
            foundComment.btnSelected = getBtnSelected(foundComment);
        }
    });
});

onUnmounted(() => {
    listenForCommentsChangesUnsubscribe?.();
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
                                <v-text-field :disabled="isSubmitting" label="Comment title"
                                    v-model="commentTitle"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea :disabled="isSubmitting" v-model="commentText"
                                    prepend-inner-icon="mdi-account-circle" counter label="Comment"></v-textarea>
                            </v-col>
                            <v-col cols="12" class="text-right">
                                <v-btn :loading="isSubmitting" @click="addCommentBtnClicked()">Submit</v-btn>
                            </v-col>
                            <v-col cols="12">
                                <v-alert v-model="showCommentPublishError" closable text="Something went wrong. Try later!"
                                    type="error" variant="outlined"></v-alert>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="1">
                        <v-timeline side="end" align="start">
                            <v-timeline-item v-for="(comment, i) in comments" :key="i" dot-color="grey-lighten-1"
                                icon="mdi-account-circle" fill-dot>
                                <v-card>
                                    <v-card-title class="text-h6 bg-grey-lighten-1">
                                        {{ comment.title }}
                                    </v-card-title>
                                    <v-card-text class="bg-white text--primary">
                                        <p>{{ comment.comment }}</p>

                                        <v-btn-toggle v-slot="{ isSelected }" color="primary" variant="plain"
                                            v-model="comment.btnSelected"
                                            @update:modelValue="btnToggleChanged(comment.id, $event)">
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
