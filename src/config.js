module.exports = {
  allowedDomains:
    process.env.NODE_ENV === 'development'
      ? ['http://localhost:3000']
      : ['https://video-game-backlog.herokuapp.com'],
  proxies: [
    {
      route: '/games',
      allowedMethods: ['GET'],
      target: 'https://api-v3.igdb.com/games',
      headers: {
        'Accept': 'application/json',
        'user-key': process.env.REACT_APP_IGDB_API_KEY
      }
    }
  ]
}
