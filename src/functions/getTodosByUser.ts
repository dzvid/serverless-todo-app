import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;

  console.log(user_id);

  const todos = await document
    .query({
      TableName: "users_todos",
      IndexName: "UserIdIndex",
      KeyConditionExpression: "user_id = :user_id",
      ExpressionAttributeValues: {
        ":user_id": user_id,
      },
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      todos: todos.Items,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
