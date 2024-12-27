import {createRouter, createWebHistory} from 'vue-router'
import Index from "@/components/Tasks/Index.vue";
import Create from "@/components/Tasks/Create.vue";
import Edit from "@/components/Tasks/Edit.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), routes: [
        {
            path: '/', name: 'task.index', component: Index
        },
        {
            path: '/tasks', name: 'tasks', component: Index

        },
        {
            path: '/tasks/create', name: 'task.create', component: Create
        },
        {
            path: '/tasks/:id', name: 'task.edit', component: Edit, props: true

        }
    ]
})

export default router
