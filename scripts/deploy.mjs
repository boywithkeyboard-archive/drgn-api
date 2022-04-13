import 'dotenv/config'
import { NodeSSH } from 'node-ssh'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

(async () => {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  , ssh = new NodeSSH()

  await ssh.connect({
    host: process.env.HOST,
    port: 22,
    username: process.env.USERNAME,
    password: process.env.PASSWORD
  })

  await ssh.putFile(join(__dirname, '../build/index.js'), '/root/drgn/index.js')

  ssh.connection.end()
  process.exit()
})()