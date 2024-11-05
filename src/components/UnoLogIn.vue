<template>
    <div class="login-screen">
        <h1>Welcome to UNO</h1>
        <div>
            <span class="text">
                <p>Choose below to sign up or sign in</p>
            </span>
            <div class="u_sign">
                <div class="field">
                    <div class="textinput">
                        <label for="username-signin">Username</label>
                        <input id="username-signin" type="text" placeholder="Enter your username" />
                    </div>
                    <div class="textinput">
                        <label for="password-signin">Password</label>
                        <input id="password-signin" type="password" placeholder="Enter your password" />
                    </div>
                    <div class="btn">
                        <button @click="signUp">Sign up</button>
                    </div>
                </div>
                <div></div>
                <div class="field">
                    <div class="textinput">
                        <label for="username-login">Username</label>
                        <input id="username-login" type="text" placeholder="Enter your username" />
                    </div>
                    <div class="textinput">
                        <label for="password-login">Password</label>
                        <input id="password-login" type="password" placeholder="Enter your password" />
                    </div>
                    <div class="btn">
                        <button @click="logIn">Log in</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useGameStore } from '../stores/GameStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useGameStore();

function logIn() {
    router.push("/setup");
}

function signUp() {
    router.push("/setup");
}
</script>

<style>
body {
    background-color: #282c34; /* Dark background for contrast */
    color: white;
    font-family: 'Arial', sans-serif; /* Set a clean font */
    margin: 0;
    padding: 0;
}

.login-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh; /* Full height for centering */
}

h1 {
    font-size: 36px;
    margin-bottom: 20px; /* Space below the title */
    color: #61dafb; /* Light blue color for the title */
}

.text {
    display: flex;
    align-self: center;
    justify-self: center;
    color: #ffffff; /* White text */
    font-size: 20px; /* Adjusted font size */
    margin-bottom: 20px; /* Space below the text */
}

.u_sign {
    display: flex;
    flex-direction: row; /* Stack fields vertically */
    max-width: 600px; /* Max width for the sign in section */
    width: 100%;
}

.field {
    display: flex;
    flex-direction: column;
    margin: 20px; /* Space between fields */
    padding: 20px; /* Padding around the fields */
    border: 1px solid #61dafb; /* Border around each field */
    border-radius: 8px; /* Rounded corners */
    background-color: rgba(255, 255, 255, 0.1); /* Slightly transparent background */
}

.textinput {
    margin-bottom: 10px; /* Space between input fields */
}

.textinput label {
    display: block; /* Block display for label */
    margin-bottom: 5px; /* Space below the label */
}

.textinput input {
    padding: 10px; /* Padding inside the input */
    border: 1px solid #61dafb; /* Border color */
    border-radius: 4px; /* Rounded corners */
    background-color: rgba(255, 255, 255, 0.2); /* Slightly transparent input background */
    color: white; /* Input text color */
    width: 90%; /* Full width input */
}

.btn {
    display: flex;
    justify-content: center; /* Center the button */
}

.btn button {
    padding: 10px 20px; /* Button padding */
    border: none; /* No border */
    border-radius: 5px; /* Rounded corners */
    background-color: #61dafb; /* Button background color */
    color: #282c34; /* Button text color */
    font-size: 16px; /* Button text size */
    cursor: pointer; /* Pointer cursor on hover */
    transition: background-color 0.3s; /* Smooth transition for hover */
}

.btn button:hover {
    background-color: #21a1f1; /* Darker blue on hover */
}

.btn button:active {
    background-color: #1a8bb1; /* Even darker on click */
}
</style>
