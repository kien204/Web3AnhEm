<script setup>
import { ref } from 'vue';

const items = ref([
    {
        id: 1,
        image: 'https://png.pngtree.com/png-clipart/20190905/original/pngtree-red-sexy-swimsuit-illustration-png-image_4516138.jpg',
        name: 'Bamboo Watch',
        view: 120,
        tim: 45,
        cmt: 12,
        ten: 'Đồng hồ tre'
    },
    {
        id: 2,
        image: 'https://png.pngtree.com/png-clipart/20190905/original/pngtree-red-sexy-swimsuit-illustration-png-image_4516138.jpg',
        name: 'Black Watch',
        view: 98,
        tim: 32,
        cmt: 7,
        ten: 'Đồng hồ đen'
    },
    {
        id: 3,
        image: 'https://png.pngtree.com/png-clipart/20190905/original/pngtree-red-sexy-swimsuit-illustration-png-image_4516138.jpg',
        name: 'Blue Band',
        view: 145,
        tim: 67,
        cmt: 23,
        ten: 'Vòng tay xanh'
    },
    {
        id: 4,
        image: 'https://png.pngtree.com/png-clipart/20190905/original/pngtree-red-sexy-swimsuit-illustration-png-image_4516138.jpg',
        name: 'Game Controller',
        view: 210,
        tim: 90,
        cmt: 34,
        ten: 'Tay cầm chơi game'
    },
    {
        id: 5,
        image: 'https://png.pngtree.com/png-clipart/20190905/original/pngtree-red-sexy-swimsuit-illustration-png-image_4516138.jpg',
        name: 'Headphones',
        view: 178,
        tim: 56,
        cmt: 21,
        ten: 'Tai nghe'
    }
]);
</script>
<template>
    <div class="flex gap-4">
        <div class="card">
            <div class="font-semibold text-xl mb-4">Truyện mới nhất</div>
            <DataView :value="items">
                <template #list="slotProps">
                    <div class="grid grid-cols-9 gap-4">
                        <div v-for="(item, index) in slotProps.items" :key="index"
                            class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
                            <div
                                class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col">
                                <div class="relative mx-auto">
                                    <img class="w-10rem h-auto" :src="item.image" :alt="item.name" />
                                </div>
                                <div class="info">
                                    <span><i class="pi pi-eye"></i>{{ item.view }}</span>
                                    <span><i class="pi pi-heart"></i> {{ item.tim }}</span>
                                    <span><i class="pi pi-comment"></i> {{ item.cmt }}</span>
                                </div>
                                <h1>{{ item.ten }}</h1>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>
    </div>
</template>

<style scoped></style>