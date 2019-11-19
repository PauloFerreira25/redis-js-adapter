const redis = require('redis')
const RedisReposiroty = require('./RedisReposiroty')
class RedisService {
  constructor () {
    this._conn = undefined
    this._config = undefined
    this._rep = new RedisReposiroty()
  }

  async getDB () {
    if (!this._conn) {
      await this.createConnection()
    }
    return this._conn
  }

  async createConnection () {
    if (this._config && this._config.connection) {
      this._conn = redis.createClient(this._config.connection)
    } else {
      throw new Error('Não existe configuração para iniciar o DB')
    }
  }

  async init (config) {
    this._config = config
    await this.createConnection()
    return this._conn
  }

  async create (key, doc) {
    if (this._config.extras.expireTimeSeconds) {
      return this._rep.SETEX(this._conn, key, this._config.extras.expireTimeSeconds, doc)
    }
  }
}
module.exports = RedisService
