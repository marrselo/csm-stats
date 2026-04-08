import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!


export const proxyOpenIaController = new Hono()

proxyOpenIaController.post('/api/openai/chat', async (c) => {
  if (!OPENAI_API_KEY) throw new HTTPException(400, { message: 'OpenAI API Key not found' });
  try {
    const body = await c.req.json()

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(body),
    })

    // const data = await response.json()

    return response
  } catch (error) {
    console.error('ERROR CHAT OPENIA', error)
    throw new HTTPException(400, { message: 'Error al conectar con OpenAI' });
  }
})


proxyOpenIaController.post('/api/openai/transcribe', async (c) => {
  if (!OPENAI_API_KEY) throw new HTTPException(400, { message: 'OpenAI API Key not found' });

  try {
    const formData = await c.req.formData()

    const file = formData.get('file') as File
    const model = (formData.get('model') as string) || 'gpt-4o-mini-transcribe'

    if (!file) {
      return c.json({ error: 'File is required' }, 400)
    }

    // Creamos nuevo FormData para reenviar a OpenAI
    const proxyForm = new FormData()
    proxyForm.append('file', file)
    proxyForm.append('model', model)

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: proxyForm,
    })

    return response
  } catch (error) {
    console.error('ERROR TRANSCRIBE OPENIA', error)
    throw new HTTPException(400, { message: 'Error al conectar con OpenAI' });
  }
})