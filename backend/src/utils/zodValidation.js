const zod = require("zod");

const signupSchema = zod.object({
  email: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

const signinSchema = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});

const updateBody = zod.object({
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
  password: zod.string().optional(),
});

const transferBody = zod.object({
  to: zod.string(),
  amount: zod.number(),
});

module.exports = {
  signupSchema,
  signinSchema,
  updateBody,
  transferBody,
};
