import { isAuthenticated } from '@/core/http';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/admin/login',
    },
    {
      path: '/admin/login',
      name: 'AdminLogin',
      component: () => import('@/views/Admin/AdminLoginView.vue'),
    },
    {
      path: '/admin/dashboard',
      name: 'AdminDashboard',
      component: () => import('@/views/Admin/AdminDashboard.vue'),
      meta: { admin: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.admin) {
    if (!isAuthenticated()) next({ name: 'AdminLogin' });
    else next();
  } else next();
});

export default router;
