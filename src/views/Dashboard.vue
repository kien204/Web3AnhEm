<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
const data = ref([]);
onMounted(async () => {
    const response = await axios.get('http://10.15.5.215:5041/api/Story/getAll');
    data.value = response.data;
});
</script>
<template>
    <div class="flex gap-4">
        <div class="card">
            <div class="font-semibold text-xl mb-4">Truyện mới nhất</div>
            <DataView :value="data.data">
                <template #list="slotProps">
                    <div class="grid grid-cols-9 gap-4">
                        <div v-for="(item, index) in slotProps.items" :key="index"
                            class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
                            <div
                                class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col">
                                <div class="relative mx-auto">
                                    <img class="w-10rem h-auto" :src="item.coverImage" :alt="item.name" />
                                </div>
                                <div class="info">
                                    <span><i class="pi pi-eye"></i>{{ item.description }}</span>
                                </div>
                                <h1>{{ item.storyName }}</h1>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>
    </div>
</template>

<style scoped></style>