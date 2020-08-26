import express from 'express'
import  body_parser from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'

export const app = express()
const { json, urlencoded } = body_parser;

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.send({message: 'hello'});
})

app.post('/', (req, res) => {
    console.log(req.body);
    res.send({message: 'ok'});
})

export const start = () => {
    app.listen(3000, () => {
        console.log('Server is connected');
    })
}
