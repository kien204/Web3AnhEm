<template>
  <div class="card grid grid-cols-2">
    <div class="w-1/2">
        <Card style="overflow: hidden">
            <template #header>
                <img alt="user header" :src="story.coverImage"/>
            </template>
            <template #content>
                <div class="card flex justify-content-center">
                    <Listbox :options="dataAll.data" optionLabel="sttName" class="w-96 md:w-14rem" >
                        <template #option="sp">
                            <div @click="pushRouter(sp.option.detailID)">
                                {{ sp.option.sttName }}
                            </div>
                        </template>
                    </Listbox>
                </div>
            </template>
        </Card> 
    </div>
    <div class="">
        <div class="flex flex-col gap-5">
            <h1 class=" text-2xl font-semibold">{{ story.storyName }}</h1>
            <p><strong>Tác giả:</strong> {{ story.storyAuthor }}</p>
            <p><strong>Mô tả:</strong> {{ story.description }}</p>
            <p><strong>Thể loại:</strong> {{ story.typeDetailStory }}</p>
            <p><strong>Ngày cập nhật:</strong> {{ formatDate(story.date) }}</p>
            <p><strong>Thêm ngày:</strong> {{ formatDate(story.createdAt) }}</p>
            <p v-if="story.updatedAt"><strong>Updated At:</strong> {{ formatDate(story.updatedAt) }}</p>
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

const formatDate = (dateStr) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
};

const pushRouter = (id) =>{
    route.push(`/view-story/${id}`);
}

const getAllDetail = async(id) =>{
    try{
        const res = await axios.get(`http://10.15.169.9:5041/api/DetailStory/get-all-detailstory/${id}`)
        dataAll.value = await res.data;
    }catch(e){
        console.log(e)
    }
}

const getStory = async(id) =>{
    try{
        const res = await axios.get(`http://10.15.169.9:5041/api/Story/getAll?id=${id}`)
        story.value = await res.data.data[0];    
    }catch(e){
        console.log(e)
    }
}

onMounted(()=>{
    params.value = router.params;
    getAllDetail(params.value.id);
    getStory(params.value.id);
});

</script>

<style>

</style>