import config from '../config'
const info = (vueCompoment, msg) => {
  if (typeof msg === "object") {
    msg = JSON.stringify(msg);
  }
  vueCompoment.$vux.alert.show({
    title: '提示',
    content: msg
  })
}
const getrealPicPath = dbpath => {
  return config.IP + ":" + config.PORT + "/" + dbpath
}
export default {
  info,
  getrealPicPath
}
