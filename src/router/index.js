    import HomeAdmin from '@/admin/layout/HomeAdmin.vue';
import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

    const router = createRouter({
        history: createWebHistory(),
            routes: [
                {
                    path: '/',
                    component: AppLayout,
                    children: [
                        {
                            path: '/',
                            name: 'dashboard',
                            component: () => import('@/views/Dashboard.vue')
                        },
                        {
                            path: '/uikit/formlayout',
                            name: 'formlayout',
                            component: () => import('@/views/uikit/FormLayout.vue')
                        },
                        {
                            path: '/uikit/input',
                            name: 'input',
                            component: () => import('@/views/uikit/InputDoc.vue')
                        },
                        {
                            path: '/uikit/button',
                            name: 'button',
                            component: () => import('@/views/uikit/ButtonDoc.vue')
                        },
                        {
                            path: '/uikit/table',
                            name: 'table',
                            component: () => import('@/views/uikit/TableDoc.vue')
                        }
                    ]
                },
                {
<<<<<<< HEAD
                    path: '/detail/:id',
                    name: 'dashboarddetail',
                    component: () => import('@/views/DashBoardDetail.vue')
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
=======
                    path: '/view/login',
                    name: 'login',
                    component: () => import('@/admin/view/Login.vue')
>>>>>>> 54eb76a04d1fa7049ca882ec3d4dcb53c02eeb2d
                },
                {
                    path: '/view/home', 
                    name: 'homeadmin',
                    component: HomeAdmin,
                    redirect: { name: 'quanlytruyen' },
                    children: [
                        {
                            path: '/view/thongke',
                            name: 'thongke',
                            component: () => import('@/admin/view/ThongKe.vue')
                        },
                        {
                            path: '/view/quanlytruyen',
                            name: 'quanlytruyen',
                            component: () => import('@/admin/view/QuanLyTruyen.vue')
                        },
                        {
                            path: '/view/quanlychap',
                            name: 'quanlychap',
                            component: () => import('@/admin/view/QuanLyChap.vue')
                        },
                        {
                            path: '/view/quanlytheloai',
                            name: 'quanlytheloai',
                            component: () => import('@/admin/view/QuanLyTheLoai.vue')
                        }
                    ]
                }   
            ]
    });

    export default router;
