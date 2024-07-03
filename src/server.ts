import fastify from "fastify";
import { db } from "./db/prisma";
import { z } from "zod";

const port = process.env.PORT ? Number(process.env.PORT) : 3333
const host = "0.0.0.0";

const app = fastify();

app.get("/users", async () => {
  const users = await db.user.findMany();

  return { users };
});

app.post("/users", async (request, reply) => {
  const createUserSchema = z.object({
    name: z.string().min(1).max(255),
    email: z.string().email(),
  });

  const { name, email } = createUserSchema.parse(request.body);

  await db.user.create({
    data: {
      name,
      email,
    },
  });

  return reply.status(200).send();
});

app.listen({ port, host }, () => console.log("HTTP server is running!"));
