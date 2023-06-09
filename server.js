import express from 'express';
import dotenv from 'dotenv';
const app = express();
dotenv.config();
import 'express-async-errors'
import morgan from 'morgan'

const port = process.env.PORT || 5000

//db authenticate user
import connectDB from './db/connect.js';

//routers
import authRouter from './routes/authRoutes.js'
import jobsRouter from './routes/jobsRoutes.js'


//middleware

import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';

if(process.env.NODE_ENV !== 'production'){
  app.use(morgan('dev'))
}
app.use(express.json());

app.get('/', (req, res) => {
  res.json({msg:'welcome'})
})

app.get('/api/v1', (req, res) => {
  res.json({msg:'welcome api'})
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', jobsRouter)


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware)



const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`)
    });
  } catch (error) {
    console.log(error);
  }
}

start()