import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'

export const proxyC3Controller = new Hono().post('/', async (c) => {
	const body = await c.req.json()

	const bodyReq = JSON.stringify(body)
	try {
		const response = await fetch(
			`https://script.google.com/macros/s/AKfycbzS2gFyXJapuNIv97sdjb-cEXehUmI0vIuzjYd2MjfyPjUxepHZCsSkyJF3V6ERGe3zjQ/exec`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: bodyReq
			}
		)

		const responseBody = await response.json()
		return c.json(responseBody)
	} catch (_error) {
		const error = _error as Error
		console.log(error)
		throw new HTTPException(400, { message: error.message })
	}
})
