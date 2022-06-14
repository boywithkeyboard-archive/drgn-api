import 'dotenv/config'
import { NodeSSH } from 'node-ssh'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

(async () => {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  , ssh = new NodeSSH()

  await ssh.connect({
    host: process.env.host,
    port: 22,
    username: process.env.username,
    privateKey: process.env.privateKey
  })

  await ssh.putFile(join(__dirname, '../dist/index.js'), '/root/drgn/dist/index.js')
  await ssh.putFile(join(__dirname, '../package.json'), '/root/drgn/package.json')
  await ssh.putFile(join(__dirname, '../package-lock.json'), '/root/drgn/package-lock.json')
  await ssh.execCommand('npm i', { cwd: '/root/drgn' })
  await ssh.execCommand('pm2 restart drgn --cron-restart="0 0 * * *" --exp-backoff-restart-delay=100')

  ssh.connection.end()
  process.exit()
})()
