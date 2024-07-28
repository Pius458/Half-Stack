const express = require('express')
const cors = require('cors')
const Note = require('./models/note')


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

  app.use(cors())
  app.use(express.static('dist'))
  app.use(express.json())
  app.use(requestLogger)

  const unknownEndpoint = (request,response) => {
    response.status(404).send({error: 'unknown endpont'})
  }

app.get('/',(request,response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request,response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/notes/:id',(request,response,next) => {
    Note.findById(request.params.id).then(note => {
        if(note){
            response.json(note)
        }else{
            response.status(404).end()
        }
    }).catch(error => next(error))
    
})

/*const generatedId = (existindId) => {
    const id = Math.floor(Math.random() * 1000) + 1

    if(id === existindId){
        return generatedId(existindId)
    }
    return id
}*/

app.post('/api/notes', (request,response,next) => {
    const body = request.body

    if(!body.content){
        return response.status(404).json({
            error : 'Content missing'
        })
    }
    //const existindId = notes.map(note => note.id)
    //const id = generatedId(existindId)

    const note = new Note({
        content : body.content,
        important : Boolean(body.important) || false,
    })
   
    note.save().then(savedNote => {
        response.json(savedNote)
    })
    .catch(error => next(error))
})

app.put('/api/notes/:id', (request,response,next) => {
    const {content,important} = request.body

    const note = {
        content : content,
        important: Boolean(important)
    }

    Note.findByIdAndUpdate(request.params.id,note, {new : true,runValidators:true,context: 'query'})
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

app.delete('/api/notes/:id',(request,response,next)=>{
    Note.findByIdAndDelete().then(result => {
        response.status(204).end()
    }).catch(error => next(error))
    
})

app.use(unknownEndpoint)

const errorHandler = (error,request,response,next) =>{
    console.error(error.message)

    if(error.name === 'CastError'){
        return response.status(400).send('malformed id')
    }else if(error.name === 'ValidationError'){
        return response.status(400).json({error: error.message})
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

