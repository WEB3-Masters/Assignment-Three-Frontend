import {createRouter, createWebHistory} from 'vue-router';
import UnoGameSetup from '../components/UnoGameSetup.vue';
import UnoGamePlay from '../components/UnoGamePlay.vue';
import UnoGameBreak from '../components/UnoGameBreak.vue';
import UnoGameOver from '../components/UnoGameOver.vue';
import UnoLogIn from '../components/UnoLogIn.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
    routes:[
    {   
        path: '/', 
        name:'Login', 
        component:UnoLogIn
    },
    {   
        path: '/setup', 
        name:'Setup', 
        component:UnoGameSetup
    },
    {   path:'/game',
        name:'Game', 
        component:UnoGamePlay, 
    },
    {
        path: "/over",
        name: "game over",
        component: UnoGameOver,
    },
    {
        path: "/break",
        name: "Break",
        component: UnoGameBreak,
    },
],
});

export default router;