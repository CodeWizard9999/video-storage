require('dotenv').config();
const CookieParser = require('restify-cookies');
const corsMiddleware = require('restify-cors-middleware');
const swaggerUi = require('swagger-ui-restify');
const restify = require('restify');
const port = require('./config/common.config').PORT;
const { userRouter, videoRouter, adminRouter, loginRouter } = require('./routes/index');
const logger = require('./utils/logger.util');
const dao = require('./dao/orm.dao');
const errorHandlerMiddleware = require('./midllewares/error-handler.middleware');
const { swaggerSpecs } = require('./swagger');

const app = restify.createServer({ handleUncaughtExceptions: true });

app.get('*api-docs(/+.*/)', ...swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpecs));

const cors = corsMiddleware({
  origins: ['*']
});

app.pre(cors.preflight);
app.use(cors.actual);

app.pre(restify.pre.sanitizePath());
app.use(restify.plugins.bodyParser({ multiples: true }));
app.use(restify.plugins.queryParser());
app.use(CookieParser.parse);

videoRouter.applyRoutes(app);
loginRouter.applyRoutes(app, '/auth');
adminRouter.applyRoutes(app);
userRouter.applyRoutes(app, '/user');

app.on('uncaughtException', errorHandlerMiddleware);

process.on('SIGINT', () => {
  process.exit();
});

(async function () {
  try {
    await dao.connect();
    logger.info('Connection has been established successfully');
  } catch (error) {
    logger.error(error, 'Unable to connect to the database:');
  }
}());

app.listen(port, () => {
  logger.info(`listening at ${port}`, app.name);
});
