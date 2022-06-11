import { Type } from '@sinclair/typebox'
import { authenticator } from 'otplib'
import { loginAttemptsCache, userCache } from '../modules/cache'
import decrypt from '../modules/decrypt'
import encrypt from '../modules/encrypt'
import getUser from '../modules/getUser'
import mailer from '../modules/mailer'
import userSchema from '../schemas/user'
import type { Router } from '../types'

const authRouter = async (api: Router) => {
  /* ................ /login ................ */

  api.post('/login', {
    schema: {
      body: Type.Object({
        email: Type.String({
          minLength: 6,
          maxLength: 64
        }),
        password: Type.Optional(
          Type.String({
            minLength: 8,
            maxLength: 64
          })
        ),
        token: Type.Optional(
          Type.String()
        ),
        pin: Type.Optional(
          Type.String({
            minLength: 6,
            maxLength: 6
          })
        )
      })
    }
  }, async (request, reply) => {
    const loginAttempts: number | undefined = await loginAttemptsCache.get(request.body.email)

    // block any further attempts
    if (loginAttempts && loginAttempts > 9)
      throw new Error('too much tries, try again in ~1h')

    // send email notification on 10 attempts
    if (loginAttempts && loginAttempts === 10)
      await mailer.sendMail({
        from: '"drgn" <noreply@support.drgnjs.com>',
        to: request.body.email,
        subject: 'Caught a hacker',
        text: `Hey there! 👋\n\nSomeone has tried to log in to your account several times. We blocked the attempt and paused the login to your account for the next hour.\n\nBest regards,\nthe drgn.js crew 😎`,
        html: `<p>Hey there! 👋<br /><br />Someone has tried to log in to your account several times. We blocked the attempt and paused the login to your account for the next hour.<br /><br />Best regards,<br />the drgn.js crew 😎</p>`
      })

    // increase login attempts
    if (!loginAttempts) await loginAttemptsCache.set(request.body.email, 1)
    else await loginAttemptsCache.update(request.body.email, loginAttempts + 1)

    const user = await getUser(request.body.email)

    if (!user)
      throw new Error('invalid email')

    // passwordless login
    if (user.passwordless) {
      if (!request.body.token) {
        const verifyToken = await reply.jwtSign({
          email: user.email
        }, { expiresIn: '10m' })

        await mailer.sendMail({
          from: '"drgn" <noreply@support.drgnjs.com>',
          to: user.email,
          subject: 'Verify your login',
          text: `Hey there! 👋\n\nSomeone is trying to log in into your account. If this is you, use the below code for the login.\n\nYour code: ${verifyToken}\n\nBest regards,\nthe drgn.js crew 😎`,
          html: `<p>Hey there! 👋<br /><br />Someone is trying to log in into your account. If this is you, use the below code for the login.<br /><br />Your code: <b>${verifyToken}</b><br /><br />Best regards,<br />the drgn.js crew 😎</p>`
        })
        
        throw new Error('missing token')
      }

      api.jwt.verify(request.body.token, async (err, decoded) => {
        if (err || decoded.email !== user.email)
          throw new Error('invalid token')
          
        return {
          user,
          token: await reply.jwtSign({
            email: user.email,
            loggedIn: true,
            ip: request.ip
          }, { expiresIn: '30d' })
        }
      })
    }

    // 2fa login
    if (user.twoFactor) {
      if (request.body.password !== await decrypt(user.password))
        throw new Error('invalid password')

      if (!request.body.pin)
        throw new Error('missing pin')

      if (!authenticator.check(request.body.pin, await decrypt(user.secret)))
        throw new Error('invalid pin')

      return {
        user,
        token: await reply.jwtSign({
          email: user.email,
          loggedIn: true,
          ip: request.ip
        }, { expiresIn: '30d' })
      }
    }

    // default login
    if (request.body.password !== await decrypt(user.password))
      throw new Error('invalid password')

    return {
      user,
      token: await reply.jwtSign({
        email: user.email,
        loggedIn: true,
        ip: request.ip
      }, { expiresIn: '30d' })
    }
  })

  /* ................ /register ................ */

  api.post('/register', {
    schema: {
      body: Type.Object({
        email: Type.String({
          minLength: 6,
          maxLength: 64
        }),
        password: Type.String({
          minLength: 8,
          maxLength: 64
        })
      })
    }
  }, async (request, reply) => {
    if (await userCache.has(request.body.email))
      throw new Error('email already taken')

    if (await userSchema.findOne({ email: request.body.email }))
      throw new Error('email already taken')

    const token = await reply.jwtSign({
      email: request.body.email,
      password: request.body.password
    }, { expiresIn: '10m' })

    await mailer.sendMail({
      from: '"drgn" <noreply@support.drgnjs.com>',
      to: request.body.email,
      subject: 'Verify your account',
      text: `Hey there! 👋\n\nClick https://api.drgnjs.com/register/complete/${token} to get verified and complete your account setup.\n\nBest regards,\nthe drgn.js crew 😎`,
      html: `<p>Hey there! 👋<br /><br />Click <a href="https://api.drgnjs.com/register/complete/${token}">here</a> to get verified and complete your account setup.<br /><br />Best regards,<br />the drgn.js crew 😎</p>`
    })
  })

  /* ................ /register/complete/:token ................ */

  api.get('/register/complete/:token', {
    schema: {
      params: Type.Object({
        token: Type.String()
      })
    }
  }, async (request, reply) => {
    api.jwt.verify(request.params.token, async (err, decoded) => {
      if (err)
        reply.redirect('https//drgnjs.com/error?registration_issue')

      const user = new userSchema({
        email: decoded.email,
        password: await encrypt(decoded.password),
        signupNumber: await userSchema.count() + 1
      })

      await user.save()

      const token = await reply.jwtSign({
        email: user.email,
        loggedIn: true,
        ip: request.ip
      }, { expiresIn: '30d' })
  
      return {
        user,
        token
      }
    })
  })
}

export default authRouter
