const expect = require('chai').expect
const redis = require('../../src/index')
describe('init', function () {
  it('Test DB não inicializado', async function () {
    try {
      await redis.getDB()
    } catch (error) {
      expect(function () {
        throw error
      }).to.throw('Não existe configuração para iniciar o DB')
    }
  })
  it('Iniciar o redis', async function () {
    const config = {
      connection: {
        port: 6379, // replace with your port
        host: 'ec2-3-15-32-117.us-east-2.compute.amazonaws.com' // replace with your hostanme or IP address
        // password: 'your password' // replace with your password
      },
      extras: {
        prefixKey: 'user_',
        expireTimeSeconds: 3600

      }
    }
    const init = await redis.init(config)
    expect(init).to.be.a('object')
  })
  it('Test DB existe', async function () {
    const db = await redis.getDB()
    expect(db).to.be.a('object')
  })
})
