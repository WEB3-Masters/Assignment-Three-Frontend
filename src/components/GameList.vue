<template>
    <div class="game-list">
        <h2>Existing Games</h2>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Hostname</th>
                    <th>Player Count</th>
                    <th>Game Status</th>
                </tr>
            </thead>
            <tbody>
                <tr 
                    v-for="game in games" 
                    :key="game.id" 
                    @click="chooseGame(game.id)" 
                    class="game-row"
                    :class="{selected: selectedGameId === game.id}"
                    >
                        <td>{{ game.id }}</td>
                        <td>{{ game.hostname }}</td>
                        <td>{{ game.playerCount }}</td>
                        <td :class="{'status-active': game.status === 'Active', 'status-inactive': game.status === 'Inactive'}">
                            {{ game.status }}
                        </td>
                </tr>
            </tbody>
        </table>
        <button @click="joinGame" :class="{disabled: !selectedGameId}">Join</button>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
    games: {
        type: Array,
        required:true
    }
});

const emit = defineEmits(['select-game']);
const selectedGameId = ref(null);

function chooseGame(gameId)
{
    selectedGameId.value = gameId;
    console.log(selectedGameId.value)
    emit('select-game', selectedGameId.value);
}

function joinGame(gameId)
{
    if(selectedGameId.value)
    {
        console.log(`Joining game ${selectedGameId.value}`);
    } else {
        console.log("No game selected");
    }
}
</script>

<style scoped>

.game-list {
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 20px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 20px;
}

.selected {
    background-color: #61dafb5a;
}

.selected:hover {
    background-color: #61dafb5a;
}

h2 {
    color: #61dafb; /* Title color to match the existing styles */
}

table {
    width: 100%; /* Full width */
    border-collapse: collapse; /* Remove space between borders */
}

th, td {
    padding: 10px; /* Padding inside table cells */
    border: 1px solid #61dafb; /* Border color */
    text-align: left; /* Align text to the left */
}

th {
    background-color: #282c34; /* Header background */
    color: white; /* Header text color */
}

tr {
    background-color: rgba(255, 255, 255, 0.1); /* Slightly transparent cell background */
    cursor: pointer;
}

tr:hover {
    background-color: rgba(255,255,255,0.2);
}

.status-active {
    color: #4caf50; /* Green color for active status */
}

.status-inactive {
    color: #f44336; /* Red color for inactive status */
}


button {
    margin: 10px;
    padding: 10px 20px; /* Button padding */
    border: none; /* No border */
    border-radius: 5px; /* Rounded corners */
    background-color: #61dafb; /* Button background color */
    color: #282c34; /* Button text color */
    cursor: pointer; /* Pointer cursor */
    transition: background-color 0.3s; /* Smooth transition */
}

button:hover {
    background-color: #21a1f1; /* Darker blue on hover */
}

.disabled {
    background-color: #282c34b7;
    border:#282c34;
    cursor:not-allowed;
}

.disabled:hover {
    background-color: #282c34b7;
    border:#282c34;
    cursor:not-allowed;
}

</style>
