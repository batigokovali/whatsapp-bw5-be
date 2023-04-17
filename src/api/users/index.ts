import Express from "express";
import createHttpError from "http-errors";
import UsersModel from "./model";

const UsersRouter = Express.Router();

UsersRouter.post("/account", async (req, res, next) => {
  try {
    const newUser = new UsersModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

export default UsersRouter;
