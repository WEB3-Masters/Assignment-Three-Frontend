import type { Card, CardColor } from "../deck";
import type { UnoFailure } from "../hand";
import type { Ref } from "vue";

export type Player = {
	id: string;
	index: number;
	name: string;
};
export interface EngineInterface {
	getPlayerName(index: number): string | undefined;
	getPlayerScore(index: number): number | undefined;
	getPlayerDeck(index: number): Card[] | undefined;
	getCurrentPlayer(): Player | undefined;
	play(cardIndex: number, nextColor?: CardColor): Card | undefined;
	decideMove(): void;
	get getDiscardPileTopCard(): Ref<Card | undefined, Card | undefined>;
	draw(): void;
	sayUno(index: number): void;
	catchUnoFailure(unoFailure: UnoFailure): boolean;
	getTargetScore(): number;
}