import Express from "express";
import createHttpError from "http-errors";
import UsersModel from "./model";
import { createAccessToken } from "../../lib/auth/tools";
import { JWTTokenAuth, UserRequest } from "../../lib/auth/jwt";

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

// Login
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

// Log out
UsersRouter.delete(
  "/session",
  JWTTokenAuth,
  async (req: UserRequest, res, next) => {
    try {
      const user = await UsersModel.findByIdAndUpdate(req.user!._id, {
        refreshToken: "",
      });
      res.send(user);
    } catch (error) {
      next(error);
    }
  }
);

// Get all the users
UsersRouter.get("/", JWTTokenAuth, async (req, res, next) => {
  try {
    const users = await UsersModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

// Get user's own info
UsersRouter.get("/me", JWTTokenAuth, async (req: UserRequest, res, next) => {
  try {
    const user = await UsersModel.findById(req.user!._id);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

// Edit user's own info
UsersRouter.put("/me", JWTTokenAuth, async (req: UserRequest, res, next) => {
  try {
    const updatedUser = await UsersModel.findOneAndUpdate(
      { _id: req.user!._id },
      req.body,
      { new: true, runValidators: true }
    );
    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
});

// Get users by ID
UsersRouter.get("/:userID", JWTTokenAuth, async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userID);
    if (user) res.send(user);
    else
      next(
        createHttpError(404, `User with id ${req.params.userID} not found!`)
      );
  } catch (error) {
    next(error);
  }
});

// Set an avatar image
UsersRouter.post(
  "/me/avatar",
  JWTTokenAuth,
  async (req: UserRequest, res, next) => {
    const user = UsersModel.findById(req.user!._id);
  }
);

export default UsersRouter;
