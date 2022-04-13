import { FastifyInstance, FastifyRequest } from 'fastify'
import fetch from 'node-fetch'
import { userCache } from '../modules/cache'
import userSchema from '../schemas/user'

interface ExtendedInstance extends FastifyInstance {
  github: {
    getAccessTokenFromAuthorizationCodeFlow: (request: FastifyRequest) => Promise<{
      token_type: string,
      access_token: string
    }>
  }
}

export default async (api: FastifyInstance) => {
  api.get('/login', async (request, reply) => {
    reply.redirect(307, request.cookies.token ? `${APP}/dashboard` : `${API}/oauth2/continue`)
  })

  api.get('/callback', async (request, reply) => {
    try {
      // fetch user from github
      const accessToken = await (api as ExtendedInstance).github.getAccessTokenFromAuthorizationCodeFlow(request)

      const res = await fetch('https://api.github.com/user', {
        headers: {
          authorization: `${accessToken.token_type} ${accessToken.access_token}`,
        }
      })

      const json = await res.json() as {
        id: string,
        name: string,
        [key: string]: any
      }

      if (!json.id) throw new Error('Something Went Wrong')

      // get user from database
      let user = await userSchema.findOne({ github: json.id })

      // create new user
      if (!user) {
        user = new userSchema({
          name: json.name,
          github: json.id
        })

        await user.save()
      }

      // cache user
      if (await userCache.has(user._id)) await userCache.update(user._id, user)
      else await userCache.set(user._id, user)

      // set cookie and redirect
      const token = await reply.jwtSign({
        user: user._id
      })
    
      reply.cookie('token', token, {
        ...(!DEV && {
          domain: 'drgnjs.com',
          secure: true
        }),
        path: '/',
        sameSite: true
      }).redirect(307, `${APP}/dashboard`)
    } catch (err) {
      reply.redirect(307, APP)
    }
  })

  api.get('/logout', async (request, reply) => {
    // @ts-ignore
    reply.cookie('token', null, {
      path: '/',
      sameSite: true,
      ...(!DEV && {
        domain: 'drgnjs.com',
        secure: true
      }),
      expires: Date.now()
    }).redirect(307, APP)
  })
}