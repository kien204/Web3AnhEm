<template>
    <div class="flex items-center">
        <div class="card grid grid-cols-2">
            <div class="w-1/2">
                <Card style="overflow: hidden">
                    <template #header>
                        <img alt="user header" :src="story.coverImage" />
                    </template>
                </Card>
            </div>
            <div class="">
                <div class="flex flex-col gap-5">
                    <h1 class="text-2xl font-semibold">{{ story.storyName }}</h1>
                    <p><strong>Tác giả:</strong> {{ story.storyAuthor }}</p>
                    <p><strong>Mô tả:</strong> {{ story.description }}</p>
                    <p><strong>Thể loại:</strong> {{ story.typeDetailStory }}</p>
                    <p><strong>Ngày cập nhật:</strong> {{ formatDate(story.date) }}</p>
                    <p><strong>Thêm ngày:</strong> {{ formatDate(story.createdAt) }}</p>
                    <p v-if="story.updatedAt"><strong>Updated At:</strong> {{ formatDate(story.updatedAt) }}</p>

                    <div class="border border-solid border-slate-200 rounded-md overflow-hidden overflow-y-auto" :class="!checkMore ? 'h-[100px]' : 'h-[250px]'">
                        <div class="flex flex-col gap-3 m-2">
                            <div class="" v-for="item in dataAll.data" :key="item">
                                <div class="border border-solid border-slate-200 hover:shadow-md rounded-md cursor-pointer" @click="pushView(item.detailId)">
                                    <p class="p-4">{{ item.chapter }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button
                        text
                        :label="!checkMore ? 'Xem thêm' : 'Thu gọn'"
                        @click="
                            () => {
                                checkMore = !checkMore;
                                console.log(checkMore);
                            }
                        "
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const router = useRoute();
const route = useRouter();
const params = ref();
const story = ref({});
const dataAll = ref([]);
const checkMore = ref(false);
const uri = ref('http://10.15.7.14');
const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
};

const pushView = (id) => {
    route.push(`/view-story/${id}`);
};

const getAllDetail = async (id) => {
    try {
        const response = await axios.get(`${uri.value}:5041/api/DetailStory/get-chapter/${id}`);
        dataAll.value = await response.data;
        // route.push(`view-story/${data.data[0].detailId}`);
    } catch (e) {
        console.log(e);
    }
};

const getStory = async (id) => {
    try {
        const res = await axios.get(`${uri.value}:5041/api/Story/getAll?id=${id}`);
        story.value = await res.data.data[0];
    } catch (e) {
        console.log(e);
    }
};

onMounted(() => {
    params.value = router.params;
    getAllDetail(params.value.id);
    getStory(params.value.id);
});
</script>

<style></style>