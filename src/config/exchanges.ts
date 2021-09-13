const config = require('./config.js')
console.log('config :>> ', config)
const exchanges: string[] = Object.keys(config.exchangeConfig)

export default exchanges
