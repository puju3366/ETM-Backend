import * as mongoose from "mongoose";
import { Log } from "./helpers/logger";

export default () => {
    const connect = async () => {
        const logger = Log.getLogger();
        try {
            await mongoose.connect(process.env.MONGOCONNURL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
            logger.info(`Successfully connected to databse!`);

        } catch (err) {
            logger.info(`Error connecting to database: ${err}`);
            return process.exit(1);
        }
    };

    connect();
    mongoose.connection.on("disconnected", connect);
};