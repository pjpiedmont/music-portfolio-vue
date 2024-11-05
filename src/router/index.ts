import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			alias: ['/home'],
			name: 'Home',
			component: HomeView,
		},
		{
			path: '/dev',
			name: 'Dev',
			component: DevView,
		},
		// {
		//   path: '/about',
		//   name: 'about',
		//   // route level code-splitting
		//   // this generates a separate chunk (About.[hash].js) for this route
		//   // which is lazy-loaded when the route is visited.
		//   component: () => import('../views/AboutView.vue')
		// },
		{
			path: '/qr',
			alias: ['/business-card'],
			name: 'QR Code',
			component: () => import('../views/QRCodeView.vue'),
		},
		{
			path: '/:pathMatch(.*)*',
			name: 'Not Found',
			component: () => import('../views/NotFoundView.vue'),
		},
	],
});

export default router;
