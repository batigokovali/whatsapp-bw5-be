import Express from "express";
import createHttpError from "http-errors";
import UsersModel from "./model";
import { createAccessToken, createRefreshToken } from "../../lib/auth/tools";
import { JWTTokenAuth, UserRequest } from "../../lib/auth/jwt";
import { avatarUploader } from "../../lib/cloudinary";
import passport from "passport";
import { googleRedirectRequest } from "../../types";

const UsersRouter = Express.Router();

// Sign up
UsersRouter.post("/account", async (req, res, next) => {
  try {
    const emailInUse = await UsersModel.findOne({ email: req.body.email });
    if (!emailInUse) {
      const newUser = new UsersModel(req.body);
      const user = await newUser.save();
      const payload = { _id: user._id, email: user.email };
      const accessToken = await createAccessToken(payload);
      const refreshToken = await createRefreshToken(payload);
      await UsersModel.findByIdAndUpdate(user._id, { refreshToken });
      res.status(201).send({ user, accessToken, refreshToken });
    } else {
      res
        .status(409)
        // 409 Conflict ->
        // https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-p2-semantics-18#section-7.4.10
        // The request could not be completed due to a conflict with the current
        // state of the resource.  This code is only allowed in situations where
        // it is expected that the user might be able to resolve the conflict
        // and resubmit the request.
        .send({ message: `This email '${req.body.email}' is already in use!` });
    }
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
      const refreshToken = await createRefreshToken(payload);
      res.send({ user, accessToken, refreshToken });
    } else {
      next(createHttpError(401, "Creditentials are not okay!"));
    }
  } catch (error) {
    next(error);
  }
});

// Log in with Google
UsersRouter.get(
  "/session/googleRedirect",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  }),
  async (req, res, next) => {
    try {
      res.redirect(
        `${process.env.FE_DEV_URL}/app?accessToken=${
          (req.user as googleRedirectRequest).accessToken
        }`
      );
      console.log(req.user);
    } catch (error) {
      next(error);
    }
  }
);

// Log out
UsersRouter.delete("/session", JWTTokenAuth, async (req, res, next) => {
  try {
    await UsersModel.findByIdAndUpdate((req as UserRequest).user!._id, {
      refreshToken: "",
    });
    res.send({ message: "Successfully logged out!" });
  } catch (error) {
    next(error);
  }
});

// Get all the users
UsersRouter.get("/", JWTTokenAuth, async (req, res, next) => {
  try {
    const users = await UsersModel.find({
      _id: { $ne: (req as UserRequest).user!._id },
    });
    res.send(users);
  } catch (error) {
    next(error);
  }
});

// Get user's own info
UsersRouter.get("/me", JWTTokenAuth, async (req, res, next) => {
  try {
    const user = await UsersModel.findById((req as UserRequest).user!._id);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

// Edit user's own info
UsersRouter.put("/me", JWTTokenAuth, async (req, res, next) => {
  try {
    const updatedUser = await UsersModel.findOneAndUpdate(
      { _id: (req as UserRequest).user!._id },
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

// Set an avatar
UsersRouter.post(
  "/me/avatar",
  avatarUploader,
  JWTTokenAuth,
  async (req, res, next) => {
    await UsersModel.findByIdAndUpdate((req as UserRequest).user!._id, {
      avatar: req.file?.path,
    });
    res.send({ avatarURL: req.file?.path });
  }
);

export default UsersRouter;
