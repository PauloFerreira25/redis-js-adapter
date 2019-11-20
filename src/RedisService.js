const redis = require('redis')
var Promise = require('bluebird')
Promise.promisifyAll(redis)
const RedisReposiroty = require('./RedisReposiroty')
const flatten = require('flat')
const unflatten = require('flat').unflatten
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

  async keyConcat (key, options) {
    if (options.noPrefix) { return key }
    if (this._config.extras.prefixKey) { return this._config.extras.prefixKey + key }
    return key
  }

  async set (key, doc, options = {}) {
    const lKey = await this.keyConcat(key, options)
    let result
    const flat = flatten(doc)
    if (this._config.extras.expireTimeSeconds) {
      result = await this._rep.hmset(this._conn, lKey, flat)
      if (result === 'OK') {
        const timeTTL = await this.expire(key, this._config.extras.expireTimeSeconds, options)
        // console.log(timeTTL)
        if (timeTTL !== 1) {
          throw new Error('Não foi possivel setar o TTL')
        }
      }
    } else {
      result = await this._rep.hmset(this._conn, lKey, flat)
    }
    if (result === 'OK') {
      return doc
    } else {
      throw new Error(result)
    }
  }

  async get (key, options = {}) {
    const lKey = await this.keyConcat(key, options)
    const flat = await this._rep.hgetall(this._conn, lKey)
    return unflatten(flat)
  }

  async keys (key, options = {}) {
    const lKey = await this.keyConcat(key, options)
    return this._rep.keys(this._conn, lKey)
  }

  async expire (key, time, options = {}) {
    const lKey = await this.keyConcat(key, options)
    return this._rep.expire(this._conn, lKey, time)
  }

  async ttl (key, options = {}) {
    const lKey = await this.keyConcat(key, options)
    return this._rep.ttl(this._conn, lKey)
  }
}
module.exports = RedisService
