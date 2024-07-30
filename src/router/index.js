import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: () => import("@/views/HomeView.vue"),
    },
    {
        path: "/story",
        name: "Story",
        component: () => import("@/views/StoryView.vue")
    },
    {
        path: "/overview",
        name: "Overview",
        component: () => import("@/views/OverviewView.vue")
    },
    {
        path: "/about",
        name: "About",
        component: () => import("@/views/AboutView.vue"),
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;
