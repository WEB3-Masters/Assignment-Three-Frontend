// src/graphqlClient.ts

type GraphQLRequestPayload = {
  query: string;
  variables?: { [key: string]: any };
};

export async function graphqlRequest<T>(payload: GraphQLRequestPayload): Promise<T> {
  const response = await fetch("http://localhost:3000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`
    },
    body: JSON.stringify(payload)
  });

  const responseBody = await response.json();
  
  if (responseBody.errors) {
    throw new Error(`GraphQL Error: ${responseBody.errors.map((err: any) => err.message).join(", ")}`);
  }
  
  return responseBody.data;
}
