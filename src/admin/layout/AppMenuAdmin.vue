<script setup>
import { ref } from 'vue';
import AppMenuItem from '@/layout/AppMenuItem.vue';

const model = ref([
    {
        label: 'Quản lý truyện',
        icon: 'pi pi-fw pi-briefcase',
        items: [
            {
                label: 'Các truyện đã đăng',
                icon: 'pi pi-list',
                to: '/auth/login'
            },
            {
                label: 'Thêm, sửa, xóa truyện',
                icon: 'pi pi-cog',
                to: '/auth/login'
            }
        ]
    },
    {
        label: 'Quản lý chap',
        icon: 'pi pi-fw pi-briefcase',
        items: [
            {
                label: 'Các chap đã đăng',
                icon: 'pi pi-list',
                to: '/auth/login'
            },
            {
                label: 'Thêm, sửa, xóa chap',
                icon: 'pi pi-cog',
                to: '/auth/login'
            }
        ]
    },
    {
        label: 'Quản lý thể loại',
        icon: 'pi pi-fw pi-briefcase',
        items: [
            {
                label: 'Danh sách các thể loại',
                icon: 'pi pi-list',
                to: '/auth/login'
            },
            {
                label: 'Thêm, sửa, xóa thể loại',
                icon: 'pi pi-cog',
                to: '/auth/login'
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