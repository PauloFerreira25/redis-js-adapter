class RedisReposiroty {
  async SETEX (_conn, key, ttl, doc) {
    const serializer = JSON.stringify(doc)
    return _conn.SETEX(key, ttl, serializer)
  }
}
module.exports = RedisReposiroty
