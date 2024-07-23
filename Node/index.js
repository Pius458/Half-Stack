const express = require('express')

const app = express()

let notes = [
    {
        id : 1 ,
        content : "HTML is easy",
        important : true
    },
    {
        id: 2,
        content: "Browser can execute only javascript",
        important: false
    },
    {
        id: 3,
        content: "GET and POSt are the most important methods of HTTP protocol",
        important: true
    }

]
app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

  const cors = require('cors')

  app.use(cors())
  app.use(express.json())
  app.use(requestLogger)

  const unknownEndpoint = (request,response) => {
    response.status(404).send({error: 'unknown endpont'})
  }

app.get('/',(request,response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/notes', (request,response) => {
    response.json(notes)
})

app.get('/notes/:id',(request,response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if(note){
        response.json(note)
    }else{
        response.status(404).end()
    }
    
})

const generatedId = (existindId) => {
    const id = Math.floor(Math.random() * 1000) + 1

    if(id === existindId){
        return generatedId(existindId)
    }
    return id
}

app.post('/notes', (request,response) => {
    const body = request.body

    if(!body.content){
        return response.status(404).json({
            error : 'Content missing'
        })
    }
    const existindId = notes.map(note => note.id)
    const id = generatedId(existindId)

    const note = {
        content : body.content,
        important : Boolean(body.important) || false,
        id : id
    }
    notes = notes.concat(note)
    
    response.json(note)
})

app.delete('/notes/:id',(request,response)=>{
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
