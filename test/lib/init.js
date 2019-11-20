const expect = require('chai').expect
const redis = require('../../src/index')
const config = require('./config')
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
    const init = await redis.init(config)
    expect(init).to.be.a('object')
  })
  it('Test DB existe', async function () {
    const db = await redis.getDB()
    expect(db).to.be.a('object')
  })
})
