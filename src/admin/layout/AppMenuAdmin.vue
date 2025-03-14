<script setup>
import { ref } from 'vue';
import AppMenuItem from '@/layout/AppMenuItem.vue';

const model = ref([
    {
        label: 'Quản lý truyện',
        icon: 'pi pi-fw pi-briefcase',
        items: [
            {
                label: 'Quản lý truyện',
                icon: 'pi pi-book',
                to: '/view/quanlytruyen'
            },
            {
                label: 'Quản lý Bình luận & Đánh giá',
                icon: 'pi pi-comment',
                to: '/view/quanlybinhluandanhgia'
            }
        ]
    },
    {
        label: 'Quản lý trang',
        icon: 'pi pi-fw pi-globe',
        items: [
            {
                label: 'Quản lý Logo & Tên trang',
                icon: 'pi pi-globe',
                to: '/view/quanlychap'
            },
            {
                label: 'Quản lý Quảng cáo',
                icon: 'pi pi-megaphone',
                to: '/view/quanlychap'
            }
        ]
    },
    {
        label: 'Quản lý thống kê',
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