import Express from "express";
import createHttpError from "http-errors";
import UsersModel from "./model";
import { createAccessToken } from "../../lib/auth/tools";

const UsersRouter = Express.Router();

// Sign up
UsersRouter.post("/account", async (req, res, next) => {
  try {
    const newUser = new UsersModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

// Sign in
UsersRouter.post("/session", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UsersModel.checkCredentials(email, password);
    if (user) {
      const payload = { _id: user._id, email: user.email };
      const accessToken = await createAccessToken(payload);
      res.send({ accessToken });
    } else {
      next(createHttpError(401, "Creditentials are not okay!"));
    }
  } catch (error) {
    next(error);
  }
});

UsersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UsersModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

UsersRouter.get("/me", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default UsersRouter;
