import { ref, type Ref } from "vue";
import type { CardColor, Card } from "./deck";
import type { UnoFailure } from "./hand";
import type { Player } from "./interfaces/engineInterface";
import { createUnoGame, type Game } from "../model/uno";
import { RoomState, type Room } from "../generated/graphql";
import { fromGraphQLCard, fromGraphQLCards } from "../utils/graphql_utils";

export class EngineService {
	newGame : Game | undefined;

	createNewGame(players: Player[]): Array<Player> {
		this.game = createUnoGame({ players, targetScore: 500, cardsPerPlayer: 7 });

		this.game.onGameEnd = (winner: number) => {
			Array.from({ length: this.game.hand?.playerCount ?? 0 }).forEach((_, index) => {
				if (this.game.score(index) >= this.game.targetScore) {
					alert(`${this.game.player(index)} has won the game!`);

					//TODO Call deleteGame function
					return;
				}
			});

			alert(`Round has ended, winner is ${this.game.player(winner)}!`);
		};

		this.discardPileTopCardRef.value = this.game.hand?.discardPile().top();

		return players;
	}

	game: Game = createUnoGame({ 
		players: [
			{id: "bot 1", name: "bot 1", index: 0},
			{id: "bot 2", name: "bot 2", index: 1}
		],
		targetScore: 500,
		cardsPerPlayer: 7
	});
	discardPileTopCardRef = ref<Card | undefined>();

	getPlayerName(index: number): string | undefined {
		return this.game.player(index)?.name;
	}

	getPlayerScore(index: number): number | undefined {
		return this.game.score(index);
	}

	getPlayerDeck(index: number): Card[] | undefined {
		return [...(this.game.hand?.playerHand(index) ?? [])];
	}
	
	getCurrentPlayer(): Player | undefined {
		const playerIndex = this.game.hand?.playerInTurn() ?? -1;
		const localPlayer = this.game.hand?.player(playerIndex);
		return localPlayer ? { 
			id: localPlayer.id ?? "", 
			name: localPlayer.name ?? "", 
			index: playerIndex 
		} : undefined;
	}
	
	play(cardIndex: number, nextColor?: CardColor): Card | undefined {
		const card = this.game.hand?.play(cardIndex, nextColor);
		if(card?.type === 'WILD' || card?.type === 'WILD DRAW')
		{
			if(!nextColor) throw new Error("Wild card needs a color");
			card.color = nextColor;
		}
		this.discardPileTopCardRef.value = this.game.hand?.discardPile().top();
		return card;
	}
	
	canPlay(cardIndex: number): boolean | undefined {
		return this.game.hand?.canPlay(cardIndex);
	}
	
	draw(): void {
		this.game.hand?.draw();
		if (!this.game.hand?.canPlayAny()) this.game.hand?.nextPlayer();
	}
	
	sayUno(index: number): void {
		this.game.hand?.sayUno(index);
	}
	
	catchUnoFailure(unoFailure: UnoFailure): boolean {
		return this.game.hand?.catchUnoFailure(unoFailure) ?? false;
	}
	
	getTargetScore(): number {
		return this.game.targetScore;
	}
	
	get getDiscardPileTopCard(): Ref<Card | undefined, Card | undefined> {
		return this.discardPileTopCardRef;
	}

	onEnd: () => void = () => {};
	
	updateFromRoom(room: Room) {
		if(room.roomState !== RoomState.InProgress) {
			return;
		}

		if (room.deck?.cards && room.deck.id) {
			this.game.hand?.updateDrawPile(fromGraphQLCards(room.deck.cards), room.deck.id);
		}

		if (room.discardPile?.cards && room.discardPile.id) {
			this.game.hand?.updateDiscardPile(fromGraphQLCards(room.discardPile.cards), room.discardPile.id);
			this.discardPileTopCardRef.value = fromGraphQLCard(room.discardPile.cards[room.discardPile.cards.length - 1]);
		}

		//Cards in hands are updated in updateAllPlayerDecks function
	}

	getGameState() {
		return {
			deck: {
				id: this.game.hand?.drawPileId(),
				cards: this.game.hand?.drawPile().toArray() ?? []
			},
			discardPile: {
				id: this.game.hand?.discardPileId(),
				cards: this.game.hand?.discardPile().toArray() ?? []
			},
			hasEnded: this.game.winner() !== undefined
		};
	}
}
