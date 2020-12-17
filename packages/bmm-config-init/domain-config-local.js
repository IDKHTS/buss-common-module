
// 若需要连接本地后端，可自行建立.env.development.local文件，git会忽略这个文件，
// 根据需要添加，如 VUE_APP_DOMAIN_ARS = 192.168.19.26:1971

const domainList = [
  ['ars', process.env.VUE_APP_DOMAIN_ARS || 'ars.dev.gdy.io'],
  ['course', process.env.VUE_APP_DOMAIN_COURSE || 'course.dev.gdy.io'],
  ['dssx', process.env.VUE_APP_DOMAIN_DSSX || 'alibaba.dev.gdy.io'],
  ['dssx_en', process.env.VUE_APP_DOMAIN_DSSX_EN || 'alibaba-en.dev.gdy.io'],
  ['fs', process.env.VUE_APP_DOMAIN_FS || 'fs.dev.gdy.io'],
  ['kuxiao', process.env.VUE_APP_DOMAIN_KUXIAO || 'rcp.dev.gdy.io'],
  ['sso', process.env.VUE_APP_DOMAIN_SSO || 'sso.dev.gdy.io'],
]

const srvList = {}

domainList.forEach((domain) => {
  const [prefix, host] = domain
  srvList[prefix] = {}
  const srv = srvList[prefix]
  srv.prefix = 'host_' + prefix
  srv.host = host
})

module.exports = {
  protocolDev: 'http:',
  protocolProd: 'https:',
  srvList,
}
