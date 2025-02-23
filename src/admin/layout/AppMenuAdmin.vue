<script setup>
import { ref } from 'vue';
import AppMenuItem from '@/layout/AppMenuItem.vue';

const model = ref([
    {
        label: 'Quản lý truyện',
        icon: 'pi pi-fw pi-briefcase',
        items: [
            {
                label: 'Chỉnh sửa truyện',
                icon: 'pi pi-cog',
                to: '/view/quanlytruyen'
            }
        ]
    },
    {
        label: 'Quản lý chương',
        icon: 'pi pi-fw pi-briefcase',
        items: [
            {
                label: 'Chỉnh sửa chương',
                icon: 'pi pi-cog',
                to: '/view/quanlychap'
            }
        ]
    },
    {
        label: 'Quản lý thể loại',
        icon: 'pi pi-fw pi-briefcase',
        items: [
            {
                label: 'Chỉnh sửa thể loại',
                icon: 'pi pi-cog',
                to: '/view/quanlytheloai'
            }
        ]
    },
    {
        label: 'Thống kê',
        icon: 'pi pi-chart-bar',
        items: [
            {
                label: 'Thống kê',
                icon: 'pi pi-chart-bar',
                to: '/view/thongke'
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>