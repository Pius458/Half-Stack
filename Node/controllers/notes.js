const noteRouter = require('express').Router()
const Note = require('../models/note')


noteRouter.get('/', (request,response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

noteRouter.get('/:id',(request,response,next) => {
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

noteRouter.post('/', (request,response,next) => {
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

noteRouter.put(':id', (request,response,next) => {
  const { content,important } = request.body

  const note = {
    content : content,
    important: Boolean(important)
  }

  Note.findByIdAndUpdate(request.params.id,note, { new : true,runValidators:true,context: 'query' })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

noteRouter.delete('/:id',(request,response,next) => {
  Note.findByIdAndDelete().then(result => {
    response.status(204).end()
  }).catch(error => next(error))

})

module.exports = noteRouter
