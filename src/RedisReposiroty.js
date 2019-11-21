const redis = require('redis')
var Promise = require('bluebird')
Promise.promisifyAll(redis)

class RedisReposiroty {
  constructor () {
    this._conn = undefined
    this._config = undefined
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

  async setex (key, ttl, doc) {
    const conn = await this.getDB()
    console.log(conn)
    const serializer = JSON.stringify(doc)
    return conn.setexAsync(key, ttl, serializer)
  }

  async set (key, doc) {
    const conn = await this.getDB()
    const serializer = JSON.stringify(doc)
    return conn.setAsync(key, serializer)
  }

  async get (key, doc) {
    const conn = await this.getDB()
    const deserializer = await conn.getAsync(key)
    return JSON.parse(deserializer)
  }

  async hmset (key, obj) {
    // console.log({ arrayData })
    // const inn = [key].concat(arrayData)
    // console.log({ inn })
    const conn = await this.getDB()
    return conn.hmsetAsync(key, obj)
  }

  async hgetall (key) {
    const conn = await this.getDB()
    return conn.hgetallAsync(key)
  }

  async keys (key) {
    const conn = await this.getDB()
    return conn.keysAsync(key)
  }

  async ttl (key) {
    const conn = await this.getDB()
    return conn.ttlAsync(key)
  }

  async expire (key, time) {
    const conn = await this.getDB()
    return conn.expireAsync(key, time)
  }

  async del (key) {
    const conn = await this.getDB()
    return conn.delAsync(key)
  }
}
module.exports = RedisReposiroty
