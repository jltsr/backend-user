import "dotenv/config";
import config from './config/config'
import express from "express";
import cors from "cors";
import compress from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import middleware  from "./helpers/middleware";

import models,{sequelize} from "./models/init-models";
import routes from './routes/IndexRoute'

// declare port
const port = process.env.PORT || 3003;

const app = express();
// parse body params and attache them to req.body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
// use helmet spy bisa dikenali SEO
app.use(helmet())
// secure apps by setting various HTTP headers
app.use(compress())
// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// load models dan simpan di req.context
app.use(async (req,res,next) =>{
    req.context = {models};
    next();
});

 const swaggerUi= require('swagger-ui-express')
 const swaggerApi = require('./apidocs.json')
 app.use(config.URL_API+"/api-docs",swaggerUi.serve, swaggerUi.setup(swaggerApi))


app.use(config.URL_API,routes.UserRoute)
app.use(middleware.handleError);
app.use(middleware.notFound);


const dropDatabaseSync = false;

sequelize.sync({force : dropDatabaseSync}).then(async ()=>{
    if(dropDatabaseSync){
        console.log("Database do not drop");
    }

    app.listen(port,()=>{
        console.log(`Server is listening on port ${port}`)
    });

})



export default app;