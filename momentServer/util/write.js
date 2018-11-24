const fs = require('fs')
const path = require('path')
const log = require('log4js').getLogger("write")

const writeBase64 = (filePath, base64Str) => {
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

const handleImageFile = (fileDir, files) => {
    let imageList = [];
    try {
        if (Array.isArray(files)) {
            for (let i = 0; i < files.length; i++) {
                writeFile(files[i].path, fileDir, i + ".png");
                let filePath = path.join(fileDir, i + ".png");
                imageList.push(filePath);
            }
        } else {
            // 创建可读流
            writeFile(files.path, fileDir, "0.png");
            let filePath = path.join(fileDir, "0.png");
            imageList.push(filePath);
        }

    } catch (e) {
        log.error(e);
    }
    return imageList;
}

const writeFile = (file, fileDir, filename) => {
    // 创建可读流
    const reader = fs.createReadStream(file);
    mkdirsSync(fileDir);
    // 创建可写流
    filePath = path.join(fileDir, filename);
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    // 处理流事件 --> data, finish, and error
    reader.on('finish', function () {
        log.info(filePath + '写入完成');
    });
    reader.on('error', function (err) {
        log.error(err.stack)
    });
}

module.exports = {
    writeBase64,
    mkdirsSync,
    handleImageFile
}