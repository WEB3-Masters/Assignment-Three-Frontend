import { Card as LocalCard, CardColor as LocalCardColor, CardType as LocalCardType } from "../model/deck";
import { CardInput, CardColor, Room, Card as GraphQLCard, RoomState } from "../generated/graphql";
import { CardType } from "../generated/graphql";
import type { Player } from "../model/interfaces/engineInterface";
import type { Difficulty } from "../model/BotAI";

export interface ExtendedPlayer extends Player { 
    isBot: boolean; 
    hand: LocalCard[]; 
    difficulty?: Difficulty;
}

// Convert local card type to GraphQL input type
export function toGraphQLCard(card: LocalCard): CardInput {
    return {
        id: card.id ?? Math.random().toString(),
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
export function fromGraphQLRoom(room: Room): {
    players: Player[];
    currentPlayerIndex: number;
    extendedPlayers: ExtendedPlayer[];
} {
    const players = room.players?.map((player, index) => ({
        id: player.id,
        name: player.username,
        index
    })) ?? [];

    const currentPlayerIndex = players.findIndex(p => 
        p.id === room.currentPlayer?.id
    );

    const extendedPlayers = room.players?.map((player, index) => ({
        id: player.id,
        name: player.username,
        index,
        isBot: player.username.includes('bot'),
        hand: player.cards ? fromGraphQLCards(player.cards) : [],
        difficulty: undefined  // This should be set by the game store
    })) ?? [];

    return {
        players,
        currentPlayerIndex: currentPlayerIndex !== -1 ? currentPlayerIndex : 0,
        extendedPlayers
    };
}

// Convert game state to GraphQL Room input
export function toGraphQLRoomInput(params: {
    roomId: string,
    players: ExtendedPlayer[],
    currentPlayerIndex: number,
    deckCards: LocalCard[],
    discardPileCards: LocalCard[],
    hasEnded: boolean
}) {
    const { roomId, players, currentPlayerIndex, deckCards, discardPileCards, hasEnded } = params;
    
    return {
        room: {
            id: roomId,
            currentPlayer: players[currentPlayerIndex] 
                ? { id: players[currentPlayerIndex].id }
                : undefined,
            deck: {
                id: roomId + "_deck",
                cards: toGraphQLCards(deckCards)
            },
            discardPile: {
                id: roomId + "_discard",
                cards: toGraphQLCards(discardPileCards)
            },
            roomState: hasEnded ? RoomState.Waiting : RoomState.InProgress,
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
