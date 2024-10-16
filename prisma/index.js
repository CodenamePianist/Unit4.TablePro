const bcrypt = require("bcrypt");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient().$extends({
  model: {
    customer: {
      async register(email, password) {
        const hashPassword = await bcrypt.hash(password, 10);
        const newCustomer = await prisma.customer.create({
          data: {
            email,
            password: hashPassword,
          },
        });
        return newCustomer;
      },
      async login(email, password) {
        const customer = await prisma.customer.findUniqueOrThrow({
          where: { email },
        });
        const valid = await bcrypt.compare(password, hashPassword);
        if (!valid) throw Error("Invalid password");
        return customer;
      },
    },
  },
});

module.exports = prisma;
