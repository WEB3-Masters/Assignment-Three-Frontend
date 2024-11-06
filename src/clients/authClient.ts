// authClient.ts
import { graphqlRequest } from './graphqlClient';

export async function registerPlayer(username: string, password: string) {
  const mutation = `
    mutation RegisterPlayer($username: String!, $password: String!) {
      registerPlayer(username: $username, password: $password) {
        id
        username
      }
    }
  `;

  const variables = { username, password };
  const data = await graphqlRequest<{ registerPlayer: { id: string; username: string } }>({
    query: mutation,
    variables,
  });

  return data.registerPlayer;
}

export async function loginPlayer(username: string, password: string) {
  const mutation = `
    mutation LoginPlayer($username: String!, $password: String!) {
      loginPlayer(username: $username, password: $password) {
        id
        error {
          message
        }
      }
    }
  `;

  const variables = { username, password };
  const data = await graphqlRequest<{ loginPlayer: { id?: string; error?: { message: string } } }>({
    query: mutation,
    variables,
  });

  return data.loginPlayer;
}
