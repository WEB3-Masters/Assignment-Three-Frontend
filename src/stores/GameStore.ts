import { ExtendedPlayer, toGraphQLRoomInput, fromGraphQLRoom } from "../utils/graphql_utils";
import { EngineService } from "../model/engineService";
import { UnoFailure } from "../model/hand";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useRoomUpdatedSubscription, useUpdateRoomMutation } from "../generated/graphql";
import { CardColor } from "../model/deck";

export const useGameStore = defineStore("game", () => {
	const players = ref<ExtendedPlayer[]>([]);
	const bots = computed(() => players.value.filter((player) => player.isBot));
	const engineService: EngineService = new EngineService();
	const currentPlayerIndex = ref(0);
	const router = useRouter();
	const roomId = ref<string>();

	function subscribeToRoomUpdates(id: string) {
		roomId.value = id;
		const { onResult } = useRoomUpdatedSubscription({ roomId: id });
		
		onResult((result) => {
			const room = result.data?.roomUpdated;
			if (!room) return;

			roomId.value = room.id;

			const { extendedPlayers, currentPlayerIndex: newCurrentPlayerIndex } = fromGraphQLRoom(room);
			
			//TODO: Remove bots?
			// Update player difficulties
			extendedPlayers.forEach(player => {
				if (player.isBot) {
					const existingBot = bots.value.find(b => b.id === player.id);
					player.difficulty = existingBot?.difficulty;
				}
			});

			players.value = extendedPlayers;
			currentPlayerIndex.value = newCurrentPlayerIndex;
			
			engineService.updateFromRoom(room);
			updateAllPlayerDecks();
		});
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
			discardPileCards: gameState.discardPile.cards,
			hasEnded: gameState.hasEnded
		};

		await updateRoom(toGraphQLRoomInput(params));
	}

	function createGame(bots: ("easy" | "medium" | "hard")[]) {
		const _players = engineService.createGame(bots);
		players.value = _players.map((player, index) => {
			const isBot = player.name.includes("bot");
			const difficulty = isBot ? bots[index - 1] : undefined;
			return {
				...player,
				isBot,
				hand: engineService.getPlayerDeck(player.index) ?? [],
				difficulty,
			};
		});

		engineService.onEnd = () => {
			const query: Record<string, string | number> = {};
			players.value.forEach((player) => {
				query[player.name] = engineService.getPlayerScore(player.index) ?? 0;
			});
			router.push({ path: "/over", query });
		};

		nextTurn();
		syncGameState();
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

	function makeBotMove() {
		setTimeout(() => {
			engineService.decideMove();
			updateAllPlayerDecks();
			nextTurn();
		}, 2500);
	}

	async function checkForUnoFailure() {
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
	}

	function updateAllPlayerDecks() {
		players.value.forEach((player) => {
			player.hand = engineService.getPlayerDeck(player.index) ?? [];
		});
	}

	async function nextTurn() {
		currentPlayerIndex.value = engineService.getCurrentPlayer()?.index ?? 0;
		const currentPlayer = players.value[currentPlayerIndex.value];
		await syncGameState();
		checkForUnoFailure().then(() => {
			if (currentPlayer?.isBot) {
				makeBotMove();
			}
		});
	}

	return {
		createGame,
		getPlayerScore,
		isPlayerInTurn,
		currentPlayerInTurn,
		play,
		canPlay,
		draw,
		sayUno,
		catchUnoFailure,
		updateAllPlayerDecks,
		getTargetScore,
		discardPileTopCard: engineService.getDiscardPileTopCard,
		players,
		bots,
		subscribeToRoomUpdates,
	};
});