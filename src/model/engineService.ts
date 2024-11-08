import { ref, type Ref } from "vue";
import type { CardColor, Card } from "./deck";
import type { UnoFailure } from "./hand";
import type { EngineInterface, Player } from "./interfaces/engineInterface";
import { createUnoGame, type Game } from "../model/uno";
import { decideMove } from "./BotAI";
import type { Room } from "../generated/graphql";
import { fromGraphQLCard, fromGraphQLCards } from "../utils/graphql_utils";
import { fromGraphQLRoom } from "../utils/graphql_utils";

export class EngineService implements EngineInterface {
	game: Game = createUnoGame({ 
		players: [
			{id: "bot 1", name: "bot 1", index: 0},
			{id: "bot 2", name: "bot 2", index: 1}
		],
		targetScore: 500,
		cardsPerPlayer: 7
	});
	discardPileTopCardRef = ref<Card | undefined>();
	bots: ("easy" | "medium" | "hard")[] = [];

	public onEnd: () => void = () => {};
	createGame(bots: ("easy" | "medium" | "hard")[]): Array<Player> {
		const players: Player[] = Array.from({ length: bots.length + 1 }, (_, index) => {
			const name = index === 0 ? "player" : `bot ${index}`;
			return {
				id: name,
				name: name,
				index
			};
		});
		
		this.bots = bots;
		this.game = createUnoGame({ players, targetScore: 500, cardsPerPlayer: 7 });
		this.game.onGameEnd = (winner: number) => {
			Array.from({ length: this.game.hand?.playerCount ?? 0 }).forEach((_, index) => {
				if (this.game.score(index) >= this.game.targetScore) {
					alert(`${this.game.player(index)} has won the game!`);
					this.onEnd();
					return;
				}
			});
			alert(`Round has ended, winner is ${this.game.player(winner)}!`);
		};
		this.discardPileTopCardRef.value = this.game.hand?.discardPile().top();
		return players;
	}
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
	decideMove(): void {
		const hand = this.game.hand;
		if (!hand) return;
		const move = decideMove(hand, this.bots[(this.game.hand?.playerInTurn() ?? 0) - 1]);
		if (move === "draw") {
			this.game.hand?.draw();
			return;
		}
		if (move.nextColor) alert("Next Color is: " + move.nextColor);
		this.play(move.cardIndex, move.nextColor);
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
	
	//TODO: We don't handle updates of cards in hand
	updateFromRoom(room: Room) {
		const { players } = fromGraphQLRoom(room);
		
		if (room.deck?.cards) {
			this.game.hand?.updateDrawPile(fromGraphQLCards(room.deck.cards));
		}

		if (room.discardPile?.cards) {
			this.game.hand?.updateDiscardPile(fromGraphQLCards(room.discardPile.cards));
			this.discardPileTopCardRef.value = fromGraphQLCard(room.discardPile.cards[room.discardPile.cards.length - 1]);
		}

		if (players.length > 0 && (!this.game.hand || this.game.hand.playerCount !== players.length)) {
			this.game = createUnoGame({ 
				players,
				targetScore: 500,
				cardsPerPlayer: 7
			});
		}
	}

	//TODO: missing ids in deck and discard pile
	getGameState() {
		return {
			deck: {
				cards: this.game.hand?.drawPile().toArray() ?? []
			},
			discardPile: {
				cards: this.game.hand?.discardPile().toArray() ?? []
			},
			hasEnded: this.game.winner() !== undefined
		};
	}
}
