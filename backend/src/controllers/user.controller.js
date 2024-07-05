const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const User = require("../models/user.model");
const {
  signupSchema,
  signinSchema,
  updateBody,
} = require("../utils/zodValidation");
const Account = require("../models/account.model");

const signup = asyncHandler(async (req, res) => {
  const body = req.body;
  const { success } = signupSchema.safeParse(body);
  if (!success) {
    throw new ApiError(400, "Invalid credentials");
  }

  const existedUser = await User.findOne({ email: body.email });

  if (existedUser) {
    throw new ApiError(400, "Email already exists");
  }

  const user = await User.create({
    email: body.email,
    firstName: body.firstName,
    lastName: body.lastName,
    password: body.password,
  });

  const userId = user._id;

  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  const token = createdUser.generateToken();

  return res.status(200).json({
    message: "User created successfully",
    token: token,
    createdUser,
  });
});

const signin = asyncHandler(async (req, res) => {
  const { success } = signinSchema.safeParse(req.body);
  if (!success) {
    throw new ApiError(400, "Invalid credentials");
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User doesn't exists");
  }

  const isPasswordValid = await user.isPasswordValid(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Password Incorrect");
  }

  const token = user.generateToken();

  return res.status(200).json({
    message: "User logged in successfully",
    token: token,
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    throw new ApiError(411, "Error while updating information");
  }

  const updatedUser = await User.updateOne({ _id: req.userId }, req.body);

  return res
    .status(200)
    .json({ message: "User updated successfully" }, { updatedUser });
});

const findUser = asyncHandler(async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  }).select("-password");

  return res.status(200).json({
    user: users.map((user) => ({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    })),
  });
});

module.exports = {
  signup,
  signin,
  updateUser,
  findUser,
};
