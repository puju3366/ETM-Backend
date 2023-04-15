"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const bodyParser = require("body-parser"); // pull information from HTML POST (express4)
const compression = require("compression"); // Compression request and response
const dotenv = require("dotenv"); // Loads environment variables from a .env
const express = require("express");
// tslint:disable-next-line: no-var-requires
require("express-async-errors");
const helmet = require("helmet"); // Security
const l10n = require("jm-ez-l10n");
const methodOverride = require("method-override"); // simulate DELETE and PUT (express4)
const morgan = require("morgan"); // log requests to the console (express4)
const path = require("path");
const trimRequest = require("trim-request");
const logger_1 = require("./helpers/logger");
const routes_1 = require("./routes");
// import * as fileUpload from "express-fileupload";
const multer = require("multer");
const cookieParser = require("cookie-parser");
const upload = multer({
    dest: '/public/assets',
});
const database_mongo_1 = require("./database_mongo");
const responseBuilder_1 = require("./helpers/responseBuilder");
const userController_1 = require("./v1/modules/user/userController");
const userController = new userController_1.UserController();
// Loads environment variables from a .env
dotenv.config();
// initialize database
database_mongo_1.default();
const cors = require('cors');
class App {
    constructor() {
        this.logger = logger_1.Log.getLogger();
        const NODE_ENV = process.env.NODE_ENV;
        const PORT = process.env.PORT;
        this.app = express();
        this.app.use(cors());
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS,PATCH");
            next();
        });
        this.app.use(helmet());
        this.app.use(cookieParser());
        this.app.use(upload.any());
        this.app.all("/*", (req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Request-Headers", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Access-Control-Allow-Headers, authorization, token, x-device-type, x-app-version, x-build-number, uuid,x-auth-token,X-L10N-Locale");
            res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
            if (req.method === "OPTIONS") {
                res.writeHead(200);
                res.end();
            }
            else {
                next();
            }
        });
        if (NODE_ENV === "development") {
            this.app.use(express.static(path.join(process.cwd(), "public")));
            // set the static files location of bower_components
            this.app.use(morgan("dev")); // log every request to the console
        }
        else {
            this.app.use(compression()); // All request compressed
            // set the static files location /public/img will be /img for users
            this.app.use(express.static(path.join(process.cwd(), "dist"), { maxAge: "7d" }));
        }
        l10n.setTranslationsFile("en", "src/language/translation.en.json");
        this.app.use(l10n.enableL10NExpress);
        this.app.use(bodyParser.json({ limit: "50mb" }));
        this.app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
        this.app.use(bodyParser.json(), (error, req, res, next) => {
            if (error) {
                return res.status(400).json({ error: req.t("ERR_GENRIC_SYNTAX") });
            }
            next();
        });
        this.app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json
        // this.app.use(fileUpload());
        this.app.use(methodOverride());
        this.app.use(trimRequest.all);
        const routes = new routes_1.Routes(NODE_ENV);
        this.app.use("/api/v1", routes.path());
        this.app.use("/", userController.adfslogin);
        this.app.listen(PORT, () => {
            this.logger.info(`The server is running in port localhost: ${process.env.PORT}`);
            this.app.use((err, req, res, next) => {
                if (err) {
                    return responseBuilder_1.ResponseBuilder.respError(res, err);
                    // SendEmail.sendRawMail(null, null, [process.env.EXCEPTION_MAIL],
                    //   `ICrowd - API (${NODE_ENV}) - Unhandled Crash`, err.stack); // sending exception email
                    // return;
                }
                next();
            });
        });
    }
}
exports.App = App;
//# sourceMappingURL=server.js.map