<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [
            { label: 'Trang chủ', icon: 'pi pi-fw pi-home', to: '/' },
        ]
    },
    {
        label: 'Khám phá',
        items: [
            { label: 'Thể loại', icon: 'pi pi-list', to: '/uikit/formlayout' },
            { label: 'Hot', icon: 'pi pi-crown', to: '/uikit/input' },
            { label: 'Lịch sử', icon: 'pi pi-history', to: '/uikit/button', class: 'rotated-icon' },
            { label: 'Yêu thích', icon: 'pi pi-heart', to: '/uikit/table', class: 'rotated-icon' },
        ]
    },
    {
        label: 'Tài khoản',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            {
                label: 'Tài khoản',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Login',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/auth/login'
                    },
                
                ]
            },
            
        ]
    },
    {
        label: 'Admin',
        items: [
            {
                label: 'Quản lý',
                icon: 'pi pi-money-bill',
                 to: ''
            },
            
        ]
    },
   
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