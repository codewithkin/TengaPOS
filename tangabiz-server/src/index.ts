import { Hono } from 'hono'
import { routes } from './routes'
import { logger } from "hono/logger";

const app = new Hono()

app.use("*", logger());

app.route("/api/tangabiz", routes)

export default app
