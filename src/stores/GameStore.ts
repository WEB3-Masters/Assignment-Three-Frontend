import type { Difficulty } from "../model/BotAI";
import type { Card, CardColor } from "../model/deck";
import { EngineService } from "../model/engineService";
import type { UnoFailure } from "../model/hand";
import type { Player } from "../model/interfaces/engineInterface";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

export const useGameStore = defineStore("game", () => {
  const players = ref<(Player & { isBot: boolean; deck: Card[]; difficulty?: Difficulty })[]>([]);
  const bots = computed(() => players.value.filter((player) => player.isBot));
  const engineService = new EngineService();
  const currentPlayerIndex = ref(0);
  const router = useRouter();

  async function createGame(bots: ("easy" | "medium" | "hard")[]) {
    const _players = await engineService.createGame(bots);
    
    players.value = _players.map((player, index) => {
      const isBot = player.name.includes("bot");
      const difficulty = isBot ? bots[index - 1] : undefined;
      return {
        ...player,
        isBot,
        deck: [],
        difficulty,
      };
    });
    
    await updateAllPlayerDecks();
    engineService.onEnd = endGame;
    nextTurn();
  }

  async function endGame() {
    const query: Record<string, string | number> = {};
    await Promise.all(players.value.map(async (player) => {
      const score = await engineService.getPlayerScore(player.index);
      query[player.name] = score ?? 0;
    }));
    router.push({ path: "/over", query });
  }

  async function play(cardIndex: number, nextColor?: CardColor) {
    try {
      await engineService.play(cardIndex, nextColor);
      await updateAllPlayerDecks();
      nextTurn();
    } catch {
      alert("Illegal card play");
    }
  }

  async function draw() {
    await engineService.draw();
    await updateAllPlayerDecks();
    nextTurn();
  }

  function isPlayerInTurn(index: number): boolean {
    return index === currentPlayerIndex.value;
  }

  function currentPlayerInTurn(): number {
    return currentPlayerIndex.value;
  }

  async function sayUno(index: number) {
    await engineService.sayUno(index);
    await updateAllPlayerDecks();
  }

  async function catchUnoFailure(unoFailure: UnoFailure) {
    const caught = await engineService.catchUnoFailure(unoFailure);
    if (caught) {
      alert(`Failure caught successfully!`);
      await updateAllPlayerDecks();
    }
  }

  async function nextTurn() {
    const currentPlayer = await engineService.getCurrentPlayer();
    currentPlayerIndex.value = currentPlayer.index;

    checkForUnoFailure().then(async () => {
      if (currentPlayer?.isBot) {
        await makeBotMove();
      }
    });
  }

  async function makeBotMove() {
    setTimeout(async () => {
      await engineService.decideMove();
      await updateAllPlayerDecks();
      nextTurn();
    }, 2500);
  }

  async function checkForUnoFailure() {
    const delayBetweenChecks = 500;
    for (const bot of players.value) {
      if (!bot.isBot) continue;

      for (const otherPlayer of players.value) {
        if (bot === otherPlayer || otherPlayer.deck.length !== 1) continue;

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
          await new Promise(resolve => setTimeout(resolve, delay));
          const isCaught = await engineService.catchUnoFailure({ accused: otherPlayer.index, accuser: bot.index });
          if (isCaught) {
            alert(`Bot ${bot.index} caught ${otherPlayer.name} for not saying Uno!`);
            await updateAllPlayerDecks();
          }
        }
      }

      await new Promise(resolve => setTimeout(resolve, delayBetweenChecks));
    }
  }

  async function updateAllPlayerDecks() {
    await Promise.all(players.value.map(async (player) => {
      player.deck = await engineService.getPlayerDeck(player.index) ?? [];
    }));
  }

  return {
    createGame,
    play,
    draw,
    sayUno,
    catchUnoFailure,
    isPlayerInTurn,
    currentPlayerInTurn,
    updateAllPlayerDecks,
    nextTurn,
    get players() {
      return players.value;
    },
  };
});
