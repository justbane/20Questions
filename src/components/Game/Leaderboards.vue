<template>
    <div class="container">
        <div class="row">
            <div class="col text-center mb-5 mt-5">
                <h3>The Leader Board</h3>
            </div>
        </div>
        <div class="row">
            <div class="col leaders">
                <table class="table">
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
            if (snapshot.val() != null) {
                self.leaders = [];
                snapshot.forEach((leader) => {
                    var id = leader.key;
                    firebase.database().ref('users/' + id).once('value').then((user) => {
                        self.leaders.push({
                            id: id,
                            name: user.val().name,
                            points: leader.val().points,
                            games: leader.val().games
                        });
                        this.sortLeaders();
                    });
                });
                
            }
        });
    },
    methods: {
        sortLeaders() {
            this.leaders.sort((a, b) => {
                const first = a.points;
                const second = b.points;
                let comparison = 0;
                if (first < second) {
                    comparison = 1;
                } else if (first > second) {
                    comparison = -1
                }
                return comparison;
            });
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