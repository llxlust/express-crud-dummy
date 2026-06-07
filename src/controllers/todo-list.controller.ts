import { NextFunction, Request } from "express";
import { ISingleResponse } from "../types/generic";
import { IRequestWithUser } from "../types/user";
import { pool } from "../server";
import { v4 as uuid } from "uuid";
import { ErrorResponse } from "../utils/error-response";
export async function CreateTodoList(
  req: Request,
  res: ISingleResponse<string>,
  next: NextFunction,
) {
  const { listName, expired_at } = req.body;
  if (!listName || !expired_at) {
    return next(new ErrorResponse("Bad Request", 400));
  }
  const user_id = (req as IRequestWithUser).user_id;
  await pool.execute(
    "INSERT INTO `todo_list` (list_name,list_id,expired_at,owner) VALUES (?,?,?,?)",
    [listName, uuid(), new Date(expired_at).toISOString(), user_id],
  );
  res.status(201).json({
    data: "Successful create list",
    success: true,
    timestamp: Date.now(),
  });
}

export async function GetAllTodoList(
  req: Request,
  res: ISingleResponse<any>,
  next: NextFunction,
) {
  const user_id = (req as IRequestWithUser).user_id;
  const [result] = await pool.execute(
    "SELECT list_name,list_id,created_at,expired_at FROM todo_list WHERE owner = ? AND isActive = true",
    [user_id],
  );
  res.status(200).json({
    data: result,
    success: true,
    timestamp: Date.now(),
  });
}

export async function FinishTodoList(
  req: Request,
  res: ISingleResponse<string>,
  next: NextFunction,
) {
  const user_id = (req as IRequestWithUser).user_id;
  const { list_id } = req.params;
  if (!list_id) {
    return next(
      new ErrorResponse("Bad Request", 400, { PARAM: "TODO_LIST_ID_REQUIRED" }),
    );
  }

  await pool.execute(
    "UPDATE todo_list SET isActive = false WHERE owner = ? AND list_id = ?",
    [user_id, list_id],
  );
  res.status(201).json({
    data: "Successful Finish Todo List",
    success: true,
    timestamp: Date.now(),
  });
}

export async function UpdateTodoList(
  req: Request,
  res: ISingleResponse<string>,
  next: NextFunction,
) {
  const { newName, newExpired } = req.body;
  const { list_id } = req.params;
  const user_id = (req as IRequestWithUser).user_id;
  if (!newName && !newExpired) {
    return next(
      new ErrorResponse("Bad Request", 400, {
        PARAMS: "REQUIRED_AT_LEAST_ONE_PARAM",
      }),
    );
  }
  let query = `UPDATE todo_list SET `;
  const payload = [];
  if (newName) {
    query = query + `list_name = ? `;
    payload.push(newName);
  }

  if (newExpired) {
    query = query + `expired_at = ? `;
    payload.push(new Date(newExpired).toISOString());
  }
  query = query + `WHERE list_id = ? AND owner = ?`;
  const toUpdate = [...payload, list_id, user_id];

  await pool.execute(query, toUpdate);

  res.status(201).json({
    data: `Successful Update Todo List`,
    success: true,
    timestamp: Date.now(),
  });
}
