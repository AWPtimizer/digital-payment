const { default: mongoose } = require("mongoose");
const Account = require("../models/account.model");
const { asyncHandler } = require("../utils/asyncHandler");
const { transferBody } = require("../utils/zodValidation");
const { ApiError } = require("../utils/ApiError");

const balance = asyncHandler(async (req, res) => {
  const account = await Account.findOne({
    userId: req.userId,
  });

  if (!account) {
    throw new ApiError(403, "Account not found");
  }

  return res.status(200).json({
    balance: account.balance,
  });
});

const transfer = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();
  const body = req.body;
  const { success } = transferBody.safeParse(body);
  if (!success) {
    throw new ApiError(403, "Invalid transfer credentials ");
  }

  const account = await Account.findOne({ userId: req.userId }).session(
    session
  );

  if (!account || account.balance < body.amount) {
    await session.abortTransaction();
    throw new ApiError(400, "Account not found / Insufficient Balance");
  }

  const toAccount = await Account.findOne({ userId: body.to }).session(session);

  if (!toAccount) {
    await session.abortTransaction();
    throw new ApiError(400, "Invalid account");
  }

  // Perform transfer
  await Account.updateOne(
    { userId: req.userId },
    { $inc: { balance: -body.amount } }
  ).session(session);
  await Account.updateOne(
    { userId: body.to },
    { $inc: { balance: body.amount } }
  ).session(session);

  await session.commitTransaction();

  return res.status(200).json({ message: "Transfer successful" });
});

module.exports = {
  balance,
  transfer,
};
