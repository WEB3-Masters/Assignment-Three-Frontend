import { type Shuffler, standardRandomizer } from "../utils/random_utils";
import type { Card } from "./deck";
import { createHand, Hand } from "./hand";
import type { Player } from "./interfaces/engineInterface";

export type Props = {
	players: Array<Player>;
	targetScore: number;
	randomize: () => number;
	shuffler: Shuffler<Card>;
	cardsPerPlayer: number;
};

export class Game {
	hand?: Hand;
	targetScore: number;
	props: Partial<Props>;
	private playerScores: number[];
	onGameEnd: (winner: number) => void = () => {};

	constructor(createGame: Partial<Props>) {
		this.props = createGame;

		this.playerScores = Array.from({ length: this.props.players?.length ?? 2 }, () => 0);

		let randomNumber = 0;
		if (this.props.randomize !== undefined) randomNumber = this.props.randomize();
		else randomNumber = standardRandomizer(this.props.players?.length ?? 2);

		if(this.props.players) {
			this.hand = createHand(
				this.props.players,
				randomNumber,
				this.props.shuffler,
				this.props.cardsPerPlayer
			);
		}

		this.hand?.onEnd(() => this.onEnd());

		if ((createGame.targetScore ?? 500) <= 0) throw Error("Target score must be bigger then 0!");

		this.targetScore = createGame.targetScore ?? 500;
	}

	player(playerIndex: number): Player | undefined {
		return this.hand?.player(playerIndex);
	}

	currentHand(): Hand | undefined {
		return this.hand;
	}

	score(playerIndex: number): number {
		return this.playerScores[playerIndex];
	}

	winner(): number | undefined {
		for (let index = 0; index < this.playerScores.length; index++) {
			if (this.playerScores[index] >= this.targetScore) return index;
		}

		return undefined;
	}

	get playerCount(): number {
		return this.hand?.playerCount ?? -1;
	}

	private onEnd() {
		if (this.winner() !== undefined) {
			this.hand = undefined;
			return;
		}

		let randomNumber = 0;
		if (this.props.randomize !== undefined) randomNumber = this.props.randomize();
		else randomNumber = standardRandomizer(this.props.players?.length ?? 2);

		const winner = this.hand?.winner();
		const score = this.hand?.score();
		if (winner !== undefined && score !== undefined) {
			this.playerScores[winner] += score;
			this.onGameEnd(winner);
		}

		const defaultPlayers: Player[] = [
			{ id: "A", name: "A", index: 0 },
			{ id: "B", name: "B", index: 1 }
		];

		this.hand = createHand(
			this.props.players ?? defaultPlayers,
			randomNumber,
			this.props.shuffler,
			this.props.cardsPerPlayer
		);

		this.hand.onEnd(() => {
			this.onEnd();
		});
	}
}

export function createUnoGame(createGame: Partial<Props>): Game {
	const game = new Game(createGame);
	return game;
}
