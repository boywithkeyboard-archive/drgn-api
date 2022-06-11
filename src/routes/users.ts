import validateSession from '../modules/validateSession'
import type { Router } from '../types'

const userRouter = async (api: Router) => {
  api.addHook('preValidation', validateSession)

  api.get('/users/@me', async request => {
    return {
      user: request.user
    }
  })

  /*
  api.patch('/users/@me/passwordless', async req => {
    
  })

  api.patch('/users/@me/2fa', async req => {
    const secret = authenticator.generateSecret()
    const keyuri = authenticator.keyuri(req.body.email, 'drgn.js', secret)
  })
  */
}

export default userRouter
