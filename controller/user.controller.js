const User = require("../models/user.model");
const Response = require("../lib/response");
const Error = require("../lib/error");
const dotenv = require("dotenv");
const redis = require("redis");
const { jwtSign } = require("../lib/jwt");
const { passwordHash, passwordCompare } = require("../lib/bcrypt");
dotenv.config();

const client = redis.createClient({ port: 6379 });
client.on("error", (error) => console.error(error));

const { JWT_SECRET } = process.env;

exports.signUp = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password, role } = req.body;
    if (!firstname || !lastname || !email || !password) {
      throw Error("Please fill all the required fields", 401);
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      throw Error("User already exist", 401);
    }
    const hashedPassword = await passwordHash(password);
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    const payload = {
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    };
    const token = await jwtSign(payload, JWT_SECRET, { expiresIn: "2h" });
    Response(res).success(
      { message: "User SignUp successfully", data: payload, token },
      201
    );
  } catch (error) {
    Response(res).error(error, error.code);
  }
};

exports.signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw Error("Please fill all the required fields", 401);
    }
    const userExist = await User.findOne({ email });
    if (!userExist) {
      throw Error("User does not exist", 401);
    }
    const isSamePassword = await passwordCompare(password, userExist.password);
    if (!isSamePassword) {
      throw Error("Password does not match", 401);
    }
    const payload = {
      id: userExist._id,
      email: userExist.email,
      role: userExist.role,
    };
    const token = await jwtSign(payload, JWT_SECRET, { expiresIn: "2h" });
    Response(res).success(
      { message: "User logged In successfully", data: payload, token },
      200
    );
  } catch (error) {
    Response(res).error(error, error.code);
  }
};

exports.fetchSingleUser = async (req, res) => {
  try {
    const { userId } = req.params;
    client.get(userId, async (_, user) => {
      if (user) {
        Response(res).success(JSON.parse(user), 200, "data fetched from cache");
      } else {
        const user = await User.findOne({ _id: userId });
        client.set(userId, JSON.stringify(user));
        Response(res).success({ user }, 200, "data fetched from the server");
      }
    });
  } catch (error) {
    Response(res).error(error, error.code);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    // get the user
    const { user } = req.params;
    // fetch the data.
    // client.get(user, async (_, user) => {
    //   if (user) {
    //     // send response from cache
    //     Response(res).success(
    //       { data: JSON.parse(user) },
    //       200,
    //       "data fetch from cache"
    //     );
    //   } else {
    //     // fetch the data.
    //     const user = await User.findOne({ _id: user });
    //     // set the data on cache
    //     client.set(user, JSON.stringify(user));
    //     // send the response
    //     Response(res).success({ user }, 200, "data fetch from the server");
    //   }
    const userExist = await User.findOne({ _id: user });
    if (!userExist) {
      throw Error("User does not exist", 401);
    }
    const updateUser = await User.findOneAndUpdate({ _id: user }, req.body, {
      new: true,
      upsert: true,
    });
    Response(res).success(
      { message: "User profile updated", data: updateUser },
      200
    );
  } catch (error) {
    Response(res).error(error, error.code);
  }
};

exports.fetchUsers = async (req, res) => {
  try {
    const Users = await User.find({});
    Response(res).success({ message: "User fetched successfully", Users }, 200);
  } catch (error) {
    Response(res).error(error, error.code);
  }
};
