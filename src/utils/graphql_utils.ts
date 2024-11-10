import { Card, Card as LocalCard, CardColor as LocalCardColor, CardType as LocalCardType } from "../model/deck";
import { CardInput, CardColor, Card as GraphQLCard, RoomState, Player } from "../generated/graphql";
import { CardType } from "../generated/graphql";

export interface ExtendedPlayer extends Pick<Player, 'id' | 'room'> {
    hand: LocalCard[]; 
    name: string;
    index: number;
}

// Convert local card type to GraphQL input type
export function toGraphQLCard(card: LocalCard): CardInput {
    return {
        id: card.id ?? new Error("Card id is required").message,
        type: toGraphQLCardType(card.type),
        color: card.color ? toGraphQLCardColor(card.color) : null,
        number: card.number ?? null
    };
}

export function toGraphQLCards(cards: LocalCard[]): CardInput[] {
    return cards.map(toGraphQLCard);
}

export function fromGraphQLCard(card: GraphQLCard): LocalCard {
    return {
        id: card.id,
        type: fromGraphQLCardType(card.type),
        color: card.color ? fromGraphQLCardColor(card.color) : undefined,
        number: card.number ?? undefined
    };
}

export function fromGraphQLCards(cards: GraphQLCard[]): LocalCard[] {
    return cards.map(fromGraphQLCard);
}

// Convert GraphQL Room type to game state
export function fromGraphQLRoom({players, currentPlayerId}: {players: Pick<Player, 'id' | 'username' | 'cards'>[], currentPlayerId: string | undefined}): {
    currentPlayerIndex: number;
    players: ExtendedPlayer[];
} {
    const local_players : ExtendedPlayer[] = players?.map((player, index) => ({
        id: player.id,
        name: player.username,
        index,
        hand: player.cards ? fromGraphQLCards(player.cards) : [],
    })) ?? [];

    const currentPlayerIndex = players.findIndex(p => 
        p.id === currentPlayerId
    );

    return {
        currentPlayerIndex: currentPlayerIndex !== -1 ? currentPlayerIndex : 0,
        players: local_players
    };
}

// Convert game state to GraphQL Room input
export function toGraphQLRoomInput(params: {
    roomId: string,
    players: ExtendedPlayer[],
    currentPlayerIndex: number,
    deckCards: LocalCard[],
    deckId?: string,
    discardPileCards: LocalCard[],
    discardPileId?: string,
    roomState: RoomState | null
}) {
    const { roomId, players, currentPlayerIndex, deckCards, discardPileCards, deckId, discardPileId, roomState } = params;
    
    console.log("Current player index", currentPlayerIndex, players[currentPlayerIndex], players);
    return {
        room: {
            id: roomId,
            currentPlayer: players[currentPlayerIndex] 
                ? { id: players[currentPlayerIndex].id }
                : undefined,
            deck: deckId ? {
                id: deckId,
                cards: toGraphQLCards(deckCards)
            } : undefined,
            discardPile: discardPileId ? {
                id: discardPileId,
                cards: toGraphQLCards(discardPileCards)
            } : undefined,
            roomState: roomState, 
            players: players.map(p => ({
                id: p.id,
                cards: toGraphQLCards(p.hand)
            }))
        }
    };
}

// Helper functions for enum conversions
function toGraphQLCardType(type: LocalCardType): CardType {
    switch (type) {
        case "NUMBERED": return CardType.Numbered;
        case "SKIP": return CardType.Skip;
        case "REVERSE": return CardType.Reverse;
        case "DRAW": return CardType.Draw;
        case "WILD": return CardType.Wild;
        case "WILD DRAW": return CardType.WildDraw;
    }
}

function fromGraphQLCardType(type: CardType): LocalCardType {
    switch (type) {
        case CardType.Numbered: return "NUMBERED";
        case CardType.Skip: return "SKIP";
        case CardType.Reverse: return "REVERSE";
        case CardType.Draw: return "DRAW";
        case CardType.Wild: return "WILD";
        case CardType.WildDraw: return "WILD DRAW";
    }
}

function toGraphQLCardColor(color: LocalCardColor): CardColor {
    switch (color) {
        case "BLUE": return CardColor.Blue;
        case "GREEN": return CardColor.Green;
        case "RED": return CardColor.Red;
        case "YELLOW": return CardColor.Yellow;
    }
}

function fromGraphQLCardColor(color: CardColor): LocalCardColor {
    switch (color) {
        case CardColor.Blue: return "BLUE";
        case CardColor.Green: return "GREEN";
        case CardColor.Red: return "RED";
        case CardColor.Yellow: return "YELLOW";
    }
}

export function toGraphQLInitialGameInput(params: {
    roomId: string,
    players: ExtendedPlayer[],
    currentPlayerIndex: number,
    deckCards: Card[],
    discardPileCards: Card[],
}) {
    const mapCardToInitialInput = (card: Card) => ({
        type: toGraphQLCardType(card.type),
        color: card.color ? toGraphQLCardColor(card.color) : undefined,
        number: card.number ?? undefined
    });

    return {
        roomId: params.roomId,
        roomState: RoomState.InProgress,
        currentPlayerId: params.players[params.currentPlayerIndex].id,
        deckCards: params.deckCards.map(mapCardToInitialInput),
        pileCards: params.discardPileCards.map(mapCardToInitialInput),
        playerCards: params.players.map(player => ({
            playerId: player.id,
            cards: player.hand.map(mapCardToInitialInput)
        }))
    };
}
