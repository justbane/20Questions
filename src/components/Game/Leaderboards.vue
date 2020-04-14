<template>
    <div class="container">
        <div class="row">
            <div class="col text-center mb-5 mt-5">
                <h3>The Leader Board</h3>
            </div>
        </div>
        <div class="row">
            <div class="col leaders">
                <div v-if="leaders.length < 1" class="text-center">
                    <p><i class="fas fa-spinner"></i> Loading data</p>
                </div>
                <table v-else class="table">
                    <thead class="thead-dark">
                        <tr>
                            <th scope="col">Placement</th>
                            <th scope="col">Player</th>
                            <th scope="col">Games Played</th>
                            <th scope="col">Points Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(leader, index) in leaders" :key="leader.id">
                            <th scope="row">#{{ index + 1 }}</th>
                            <td>{{ leader.name }}</td>
                            <td>{{ leader.games }}</td>
                            <td>{{ leader.points }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase';

export default {
    name: 'Leaderboards',
    data() {
        return {
            leaders: []
        }
    },
    mounted() {
        var self = this;
        firebase.database().ref('leaderboard').on('value', (snapshot) => {
            var userId = Object.keys(snapshot.val())[0];
            self.leaders = [];
            snapshot.forEach((leader) => {
                firebase.database().ref('users/' + userId).once('value').then((user) => {
                    self.leaders.push({
                        id: userId,
                        name: user.val().name,
                        points: leader.val().points,
                        games: leader.val().games
                    });
                });
            });
            this.sortLeaders();
        });
    },
    methods: {
        sortLeaders() {
            this.leaders.sort(function(a, b){return b.points-a.points});
        }
    }
}
</script>

<style lang="less" scoped>
    .leaders {
        text-align: left;

        ul {
            padding: 0;
            list-style: none;

            .profileImg {
                max-width: 20px;
                max-height: 20px;
            }
        }
    }
</style>