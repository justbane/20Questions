import Home from './components/Home.vue';
import GameList from './components/Game/GameList.vue'
import GameScreen from './components/Game/GameScreen.vue';
import Leaderboards from './components/Game/Leaderboards.vue';
import PageNotFound from './components/PageNotFound.vue';

export const routes = [
    { 
        path: '/', 
        name: 'home', 
        component: Home 
    },
    { 
        path: '/games', 
        name: 'games', 
        component: GameList, 
        meta: {
            requiresAuth: true
        }
    },
    { 
        path: '/game/:id', 
        name: 'game', 
        component: GameScreen, 
        meta: {
            requiresAuth: true
        },
        props: true
    },
    {
        path: '/leaderboards',
        name: 'leaderboards',
        component: Leaderboards,
        meta: {
            requiresAuth: true
        }
    },
    { path: "*", component: PageNotFound }
]
