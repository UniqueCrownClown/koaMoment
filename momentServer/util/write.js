const fs = require('fs')
const path = require('path')

const writeBase64 =(filePath,base64Str) =>{
  mkdirsSync(path.dirname(filePath));
  //去掉图片base64码前面部分data:image/png;base64
  var base64 = base64Str.replace(/^data:image\/\w+;base64,/, '');
  //把base64码转成buffer对象
  var dataBuffer = new Buffer(base64, 'base64');
  console.log('dataBuffer是否是Buffer对象：' + Buffer.isBuffer(dataBuffer));
  fs.writeFileSync(filePath, dataBuffer);
}
// 写入目录
const mkdirsSync = (dirname) => {
  if (fs.existsSync(dirname)) {
      return true;
  } else {
      if (mkdirsSync(path.dirname(dirname))) {
          fs.mkdirSync(dirname);
          return true;
      }
  }
  return false;
};

//获取ip
const getIPAdress = () => {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
      var iface = interfaces[devName];
      for (var i = 0; i < iface.length; i++) {
          var alias = iface[i];
          if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
              return alias.address;
          }
      }
  }
}

module.exports = writeBase64