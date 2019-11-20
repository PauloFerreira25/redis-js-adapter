class RedisReposiroty {
  async setex (_conn, key, ttl, doc) {
    const serializer = JSON.stringify(doc)
    // return _conn.setex(key, ttl, serializer)
    // console.log({ key }, { serializer })
    return _conn.setexAsync(key, ttl, serializer)
  }

  async set (_conn, key, doc) {
    const serializer = JSON.stringify(doc)
    return _conn.setAsync(key, serializer)
  }

  async hmset (_conn, key, obj) {
    // console.log({ arrayData })
    // const inn = [key].concat(arrayData)
    // console.log({ inn })
    return _conn.hmsetAsync(key, obj)
  }

  async hgetall (_conn, key) {
    return _conn.hgetallAsync(key)
  }

  async keys (_conn, key) {
    return _conn.keysAsync(key)
  }

  async ttl (_conn, key) {
    return _conn.ttlAsync(key)
  }

  async expire (_conn, key, time) {
    return _conn.expireAsync(key, time)
  }
}
module.exports = RedisReposiroty
