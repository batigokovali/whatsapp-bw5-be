import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UsersModel from "../../api/users/model";
import { createAccessToken } from "./tools";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, API_URL } = process.env;

const googleStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID!,
    clientSecret: GOOGLE_CLIENT_SECRET!,
    callbackURL: `${API_URL}/users/session/googleRedirect`,
  },
  async (_, __, profile, passportNext) => {
    try {
      const { email, given_name, family_name, sub, picture } = profile._json;
      const user = await UsersModel.findOne({ email });
      if (user) {
        const accessToken = await createAccessToken({
          _id: user._id,
          email: user.email,
        });
        passportNext(null, { accessToken });
      } else {
        const newUser = new UsersModel({
          name: given_name,
          surname: family_name,
          email,
          googleId: sub,
          avatar: picture,
          password: Math.random().toString(36).slice(-10), // generating a random password for those who sign up with Google
        });
        const createdUser = await newUser.save();
        const accessToken = await createAccessToken({
          _id: createdUser._id,
          email: createdUser.email,
        });
        passportNext(null, { accessToken });
      }
    } catch (error) {
      passportNext(error as Error);
    }
  }
);

export default googleStrategy;
