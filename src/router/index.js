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
                    path: '/view/login',
                    name: 'login',
                    component: () => import('@/admin/view/Login.vue')
                },
                {
                    path: '/view/home', 
                    name: 'homeadmin',
                    component: HomeAdmin,
                    redirect: { name: 'thongke' },
                    children: [
                        {
                            path: '/view/thongke',
                            name: 'thongke',
                            component: () => import('@/admin/view/ThongKe.vue')
                        }
                    ]
                }   
            ]
    });

    export default router;
