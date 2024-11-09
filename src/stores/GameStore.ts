import { ExtendedPlayer, toGraphQLRoomInput, fromGraphQLRoom, toGraphQLInitialGameInput } from "../utils/graphql_utils";
import { EngineService } from "../model/engineService";
import { UnoFailure } from "../model/hand";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useRoomUpdatedSubscription, useUpdateRoomMutation, useJoinRoomMutation, RoomState } from "../generated/graphql";
import { CardColor } from "../model/deck";
import { useInitializeGameMutation } from "../generated/graphql";
import { useCreateRoomMutation } from "../generated/graphql";

export const useGameStore = defineStore("game", () => {
	const players = ref<ExtendedPlayer[]>([]);
	const roomId = ref<string>();
	const currentPlayerIndex = ref(0);
	const gameStarted = ref(false);
	const MAX_PLAYERS = 4;

	const engineService: EngineService = new EngineService();

	let stopSubscription: (() => void) | undefined;
	const router = useRouter();

	const { mutate: joinRoom } = useJoinRoomMutation();

	function subscribeToRoomUpdates(id: string) {
		unsubscribeFromRoom();
		
		roomId.value = id;
		const { onResult, onError, stop } = useRoomUpdatedSubscription({ roomId: id });
		
		stopSubscription = stop;
		
		onResult((result) => {
			const room = result.data?.roomUpdated;
			if (!room) return;

			roomId.value = room.id;

			const { players:extendedPlayers, currentPlayerIndex: newCurrentPlayerIndex } = fromGraphQLRoom({players: room.players ?? [], currentPlayerId: room.currentPlayer?.id});

			players.value = extendedPlayers;
			currentPlayerIndex.value = newCurrentPlayerIndex;
			
			engineService.updateFromRoom(room);
			updateAllPlayerDecks();
		});

		onError((error) => {
			console.error('Subscription error:', error);
		});
	}

	function unsubscribeFromRoom() {
		if (stopSubscription) {
			stopSubscription();
			stopSubscription = undefined;
		}
	}

	const { mutate: updateRoom } = useUpdateRoomMutation();

	async function syncGameState() {
		if (!roomId.value) return;

		const gameState = engineService.getGameState();
		const params = {
			roomId: roomId.value,
			players: players.value,
			currentPlayerIndex: currentPlayerIndex.value,
			deckCards: gameState.deck.cards,
			deckId: gameState.deck.id,
			discardPileCards: gameState.discardPile.cards,
			discardPileId: gameState.discardPile.id,
			roomState: gameState.hasEnded ? RoomState.InProgress : null
		};

		if(!gameState.hasEnded) {
			await updateRoom(toGraphQLRoomInput(params));
		}
		else{
			//TODO: Handle end of game
		}

	}

	async function play(cardIndex: number, nextColor?: CardColor) {
		try {
			engineService.play(cardIndex, nextColor);
			updateAllPlayerDecks();
			nextTurn();
			await syncGameState();
		} catch {
			alert("Illegal card play");
		}
	}

	function canPlay(cardIndex: number) {
		return engineService.canPlay(cardIndex);
	}

	function draw() {
		engineService.draw();
		updateAllPlayerDecks();
		nextTurn();
	}

	function getPlayerScore(index: number): number {
		return engineService.getPlayerScore(index) ?? 0;
	}

	function isPlayerInTurn(index: number): boolean {
		return index === currentPlayerIndex.value;
	}

	function currentPlayerInTurn(): number {
		return currentPlayerIndex.value+1;
	}

	function sayUno(index: number) {
		engineService.sayUno(index);
		updateAllPlayerDecks();
	}

	function catchUnoFailure(unoFailure: UnoFailure) {
		engineService.catchUnoFailure(unoFailure);
	}

	function getTargetScore() {
		return engineService.getTargetScore();
	}

	//TODO: If we want to add saying uno, we need to add some logic here
	/*async function checkForUnoFailure() {
		const delayBetweenChecks = 500;
		for (const bot of players.value) {
			if (!bot.isBot) continue;
			for (const otherPlayer of players.value) {
				if (bot === otherPlayer || otherPlayer.hand.length !== 1) continue;
				let catchProbability = 0;
				let delay = 0;
				switch (bot.difficulty) {
					case "easy":
						catchProbability = 0.2;
						delay = Math.random() * 2000 + 2000;
						break;
					case "medium":
						catchProbability = 0.5;
						delay = Math.random() * 1500 + 1000;
						break;
					case "hard":
						catchProbability = 0.8;
						delay = Math.random() * 1000 + 500;
						break;
				}
				if (Math.random() < catchProbability) {
					await new Promise((resolve) => setTimeout(resolve, delay));
					const isCaught = engineService.catchUnoFailure({ 
						accused: otherPlayer.index, 
						accuser: bot.index 
					});
					if (isCaught) {
						alert(`Bot ${bot.index} caught ${otherPlayer.name} for not saying Uno!`);
						updateAllPlayerDecks();
					}
				}
			}
			await new Promise((resolve) => setTimeout(resolve, delayBetweenChecks));
		}
	}*/

	function updateAllPlayerDecks() {
		players.value.forEach((player) => {
			player.hand = engineService.getPlayerDeck(player.index) ?? [];
		});
	}

	async function nextTurn() {
		currentPlayerIndex.value = engineService.getCurrentPlayer()?.index ?? 0;
		await syncGameState();
		//checkForUnoFailure();
	}

	async function joinGameRoom(roomId: string, playerId: string) {
		try {
			const result = await joinRoom({ roomId, playerId: playerId});
			const room = result?.data?.joinRoom;
			
			if (!room) {
				throw new Error("Failed to join room");
			}

			subscribeToRoomUpdates(roomId);

			const { players: extendedPlayers, currentPlayerIndex: newCurrentPlayerIndex } = fromGraphQLRoom({players: room.players ?? [], currentPlayerId: room.currentPlayer?.id});
			players.value = extendedPlayers;
			currentPlayerIndex.value = newCurrentPlayerIndex;
						
			await syncGameState();
		} catch (error) {
			console.error("Failed to join room:", error);
			throw error;
		}
	}

	async function startGame() {
		if (!roomId.value || players.value.length < 2) return;
		
		gameStarted.value = true;

		engineService.createNewGame(players.value);
		const gameState = engineService.getGameState();

		const { mutate: initializeGame } = useInitializeGameMutation();

		const params = {
			roomId: roomId.value,
			players: players.value,
			currentPlayerIndex: currentPlayerIndex.value,
			deckCards: gameState.deck.cards,
			discardPileCards: gameState.discardPile.cards,
		};

		engineService.onEnd = () => {
			const query: Record<string, string | number> = {};
			players.value.forEach((player) => {
				query[player.name] = engineService.getPlayerScore(player.index) ?? 0;
			});
			router.push({ path: "/over", query });

			//TODO: Handle end of game
		};

		await initializeGame({ gameInput: toGraphQLInitialGameInput(params) });
	}

	async function createRoom() {
		const { mutate: createRoomMutation } = useCreateRoomMutation();
		
		try {
			const result = await createRoomMutation();
			const room = result?.data?.createRoom;
			
			if (!room) {
				throw new Error("Failed to create room");
			}
			
			// Update local state
			const { players: extendedPlayers, currentPlayerIndex: newCurrentPlayerIndex } = fromGraphQLRoom({
				players: room.players ?? [], 
				currentPlayerId: room.currentPlayer?.id
			});
			
			players.value = extendedPlayers;
			currentPlayerIndex.value = newCurrentPlayerIndex;
			
			await syncGameState();
			
			return room.id;
		} catch (error) {
			console.error("Failed to create room:", error);
			throw error;
		}
	}

	return {
		startGame,
		createRoom,
		joinRoom: joinGameRoom,
		subscribeToRoomUpdates,
		unsubscribeFromRoom,

		updateAllPlayerDecks,

		getPlayerScore,
		isPlayerInTurn,
		currentPlayerInTurn,
		play,
		canPlay,
		draw,
		sayUno,
		catchUnoFailure,
		getTargetScore,

		discardPileTopCard: engineService.getDiscardPileTopCard,
		players,
		gameStarted,
		MAX_PLAYERS,
	};
});