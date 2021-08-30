import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidV4 } from "uuid";
import { document } from "../utils/dynamodbClient";

interface ICreateTodo {
  title: string;
  deadline: string;
}

interface ITodo {
  id: string;
  user_id: string;
  title: string;
  done: boolean;
  deadline: string;
}

export const handle: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as ICreateTodo;

  const todo: ITodo = {
    id: uuidV4(),
    user_id,
    title,
    done: false,
    deadline: new Date(deadline).toISOString(),
  };

  await document
    .put({
      TableName: "users_todos",
      Item: todo,
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Created!",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
