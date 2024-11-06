import { ref, type Ref } from "vue";
import type { Deck, CardColor, Card } from "./deck";
import type { UnoFailure } from "./hand";
import type { EngineInterface, Player } from "./interfaces/engineInterface";
import { createUnoGame, type Game } from "../model/uno";
import { graphqlRequest } from "../clients/graphqlClient"; // Assume graphqlRequest is an async function for making requests

export class EngineService  {
  game: Game = createUnoGame({ players: ["a", "b"] });
  discardPileTopCardRef = ref<Card | undefined>();
  bots: ("easy" | "medium" | "hard")[] = [];
  public onEnd: () => void = () => {};

  async createGame(bots: ("easy" | "medium" | "hard")[]): Promise<Array<Player>> {
    const players = Array.from({ length: bots.length + 1 }, (_, index) => {
      if (index === 0) return "player";
      return `bot${index}`;
    });
    this.bots = bots;

    const response = await graphqlRequest({
      query: `
        mutation createRoom($hostId: String!) {
          createRoom(hostId: $hostId) {
            id
            players {
              id
              username
            }
          }
        }
      `,
      variables: { hostId: this.getHostId() },
    });

    const room = response.data.createRoom;
    this.game = createUnoGame({ players: room.players.map((p: Player) => p.username), targetScore: 500, cardsPerPlayer: 7 });

    this.game.onGameEnd = async (winner: number) => {
      const playersWithScores = await Promise.all(
        Array.from({ length: this.game.hand?.playerCount ?? 0 }).map(async (_, index) => {
          const score = await this.getPlayerScore(index);
          return { player: this.game.player(index), score };
        })
      );

      playersWithScores.forEach(({ player, score }) => {
        if (score && score >= this.game.targetScore) {
          alert(`${player} has won the game!`);
          this.onEnd();
        }
      });
      alert(`Round has ended, winner is ${this.game.player(winner)}!`);
    };

    this.discardPileTopCardRef.value = this.game.hand?.discardPile().top();
    return room.players.map((player: Player, index: number) => {
      return { name: player.username, index };
    });
  }

  async getPlayerName(index: number): Promise<string | undefined> {
    const response = await graphqlRequest({
      query: `
        query getPlayer($id: String!) {
          player(id: $id) {
            username
          }
        }
      `,
      variables: { id: this.game.playerId(index) },
    });
    return response.data.player?.username;
  }

  async getPlayerScore(index: number): Promise<number | undefined> {
    const response = await graphqlRequest({
      query: `
        query getRoomScore($roomId: String!) {
          room(id: $roomId) {
            players {
              id
              score
            }
          }
        }
      `,
      variables: { roomId: this.getRoomId() },
    });
    return response.data.room?.players[index]?.score;
  }

  async getPlayerDeck(index: number): Promise<Card[] | undefined> {
    const response = await graphqlRequest({
      query: `
        query getRoomHands($roomId: String!) {
          room(id: $roomId) {
            hands {
              playerId
              cards {
                id
                type
                color
                number
              }
            }
          }
        }
      `,
      variables: { roomId: this.getRoomId() },
    });
    const hand = response.data.room.hands.find((hand: any) => hand.playerId === this.game.playerId(index));
    return hand ? hand.cards : undefined;
  }

  async getCurrentPlayer(): Promise<Player> {
    const response = await graphqlRequest({
      query: `
        query getCurrentHand($roomId: String!) {
          room(id: $roomId) {
            currentHand {
              playerId
            }
          }
        }
      `,
      variables: { roomId: this.getRoomId() },
    });
    const playerId = response.data.room.currentHand?.playerId;
    return { name: await this.getPlayerName(this.getPlayerIndex(playerId)), index: this.getPlayerIndex(playerId) };
  }

  async play(cardIndex: number, nextColor?: CardColor): Promise<Card | undefined> {
    const response = await graphqlRequest({
      query: `
        mutation playCard($roomId: String!, $cardIndex: Int!, $nextColor: String) {
          playCard(roomId: $roomId, cardIndex: $cardIndex, nextColor: $nextColor) {
            id
            type
            color
          }
        }
      `,
      variables: {
        roomId: this.getRoomId(),
        cardIndex,
        nextColor: nextColor ?? null,
      },
    });
    const card = response.data.playCard;
    this.discardPileTopCardRef.value = card;
    return card;
  }

  async draw(): Promise<void> {
    await graphqlRequest({
      query: `
        mutation drawCard($roomId: String!) {
          drawCard(roomId: $roomId)
        }
      `,
      variables: { roomId: this.getRoomId() },
    });
  }

  async sayUno(index: number): Promise<void> {
    await graphqlRequest({
      query: `
        mutation sayUno($roomId: String!, $playerId: String!) {
          sayUno(roomId: $roomId, playerId: $playerId)
        }
      `,
      variables: { roomId: this.getRoomId(), playerId: this.game.playerId(index) },
    });
  }

  async catchUnoFailure(unoFailure: UnoFailure): Promise<boolean> {
    const response = await graphqlRequest({
      query: `
        mutation catchUnoFailure($roomId: String!, $unoFailure: UnoFailureInput!) {
          catchUnoFailure(roomId: $roomId, unoFailure: $unoFailure)
        }
      `,
      variables: { roomId: this.getRoomId(), unoFailure },
    });
    return response.data.catchUnoFailure;
  }

  async getTargetScore(): Promise<number> {
    const response = await graphqlRequest({
      query: `
        query getTargetScore($roomId: String!) {
          room(id: $roomId) {
            targetScore
          }
        }
      `,
      variables: { roomId: this.getRoomId() },
    });
    return response.data.room.targetScore;
  }

  async getDiscardPileTopCard(): Promise<Ref<Card | undefined>> {
    const response = await graphqlRequest({
      query: `
        query getDiscardPileTopCard($roomId: String!) {
          room(id: $roomId) {
            discardPile {
              top {
                id
                type
                color
              }
            }
          }
        }
      `,
      variables: { roomId: this.getRoomId() },
    });
    this.discardPileTopCardRef.value = response.data.room.discardPile.top;
    return this.discardPileTopCardRef;
  }

  private getRoomId(): string {
    // Your logic to get the current room ID
  }

  private getHostId(): string {
    // Your logic to get the current host ID
  }

  private getPlayerIndex(playerId: string): number {
    // Your logic to get the player index based on playerId
  }
}
