
const RedisReposiroty = require('./RedisReposiroty')
const flatten = require('flat')
const unflatten = require('flat').unflatten
const NativeObject = require('./NativeObject')
const nativeObject = new NativeObject()
class RedisService {
  constructor () {
    this._conn = undefined
    this._config = undefined
    this._rep = new RedisReposiroty()
  }

  async getDB () {
    return this._rep.getDB()
  }

  async init (config) {
    this._config = config
    await this._rep.init(config)
    return this._rep.getDB()
  }

  async keyConcat (key, options) {
    if (options.noPrefix) { return key }
    if (this._config.extras.prefixKey) { return this._config.extras.prefixKey + key }
    return key
  }

  async keyUnConcat (key, options) {
    if (options.noPrefix) { return key }
    if (this._config.extras.prefixKey) { return key.replace(this._config.extras.prefixKey, '') }
    return key
  }

  async hmset (key, doc, options = {}) {
    const lKey = await this.keyConcat(key, options)
    let result
    const flat = flatten(doc)
    if (this._config.extras.expireTimeSeconds) {
      result = await this._rep.hmset(lKey, flat)
      if (result === 'OK') {
        const timeTTL = await this.expire(key, this._config.extras.expireTimeSeconds, options)
        // console.log(timeTTL)
        if (timeTTL !== 1) {
          throw new Error('Não foi possivel setar o TTL')
        }
      }
    } else {
      result = await this._rep.hmset(lKey, flat)
    }
    if (result === 'OK') {
      return doc
    } else {
      throw new Error(result)
    }
  }

  async hgetall (key, options = {}) {
    const lKey = await this.keyConcat(key, options)
    const flat = await this._rep.hgetall(lKey)
    return unflatten(await nativeObject.converter(flat))
  }

  async keys (key, options = {}) {
    const lKey = await this.keyConcat(key, options)
    const result = await this._rep.keys(lKey)
    const pall = result.map(e => this.keyUnConcat(e, options))
    return Promise.all(pall)
  }

  async expire (key, time, options = {}) {
    const lKey = await this.keyConcat(key, options)
    return this._rep.expire(lKey, time)
  }

  async ttl (key, options = {}) {
    const lKey = await this.keyConcat(key, options)
    return this._rep.ttl(lKey)
  }

  async del (key, options = {}) {
    const lKey = await this.keyConcat(key, options)
    const r = await this._rep.del(lKey)
    return (r === 1)
  }
}
module.exports = RedisService
