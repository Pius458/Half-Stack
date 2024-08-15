const noteRouter = require('express').Router()
const Note = require('../models/note')


noteRouter.get('/', async (request,response) => {
  const notes = await Note.find({})
  response.json(notes)
})

noteRouter.get('/:id',async (request,response) => {
  const note = await Note.findById(request.params.id)
  if(note) {
    response.json(note)
  }else {
    response.status(404).end()
  }

})


noteRouter.post('/', async (request,response) => {
  const body = request.body

  if(!body.content){
    return response.status(400).json({
      error : 'Content missing'
    })
  }


  const note = new Note({
    content : body.content,
    important : Boolean(body.important) || false,
  })

    const saveNote = await note.save()
    response.status(201).json(saveNote)
  
})

noteRouter.put('/:id', async(request,response) => {
  const { content,important } = request.body

  const note = {
    content : content,
    important: Boolean(important)
  }

  const updatedNote = await Note.findByIdAndUpdate(request.params.id,note, { new : true,runValidators:true,context: 'query' })
  response.json(updatedNote)
    
})

noteRouter.delete('/:id', async (request,response) => {
  await Note.findByIdAndDelete().then( () => {
    response.status(204).end()
  })

})

module.exports = noteRouter
