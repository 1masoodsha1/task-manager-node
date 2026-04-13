import "reflect-metadata";
import path from "path";
import { DataSource } from "typeorm";
import { Task } from "./entity/Task";

export const AppDataSource = new DataSource({
type: "sqlite",
database: path.join(__dirname, "../data/appdb.db"),
  synchronize: true,
  logging: false,
  entities: [Task],
});