import koa from "koa";
import {} from "@card-engine-nx/engine";
import { createState } from "@card-engine-nx/state";

const state = createState();

const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = new koa();

app.use(async (ctx) => {
  ctx.body = state;
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
