#! /usr/bin/env node
console.log("bmm-cli is coming for you,hey hey ...");

const { program } = require("commander");
const fs = require("fs");
const path = require("path");

// 查看版本
program.version(require("./package.json").version, "-v, --version, -V");

// 创建项目
program
  .command("create <name>")
  .description("create <name> project")
  .action(function (name, cmd) {
    console.log("start create project:", name);
    if( !name ){
      console.error('param name is not exist')
    }
    var PATH = ".";
    mkdir(PATH + "/vue", function () {
      checkDirectory(
        __dirname + "/templates/init-project",
        PATH + "/" + name,
        copy
      );
    });
  });
program.parse(process.argv);

// 复制目录
var copy = function (src, dst) {
  let paths = fs.readdirSync(src); //同步读取当前目录(只能读取绝对路径，相对路径无法获取)
  paths.forEach(function (path) {
    var _src = src + "/" + path;
    var _dst = dst + "/" + path;
    fs.stat(_src, function (err, stats) {
      //stats  该对象 包含文件属性
      if (err) throw err;
      if (stats.isFile()) {
        //如果是个文件则拷贝
        let readable = fs.createReadStream(_src); //创建读取流
        let writable = fs.createWriteStream(_dst); //创建写入流
        readable.pipe(writable);
      } else if (stats.isDirectory()) {
        //是目录则 递归
        checkDirectory(_src, _dst, copy);
      }
    });
  });
};
var checkDirectory = function (src, dst, callback) {
  if (dst.indexOf("node_modules") !== -1) {
    return;
  }
  fs.access(dst, fs.constants.F_OK, (err) => {
    if (err) {
      fs.mkdirSync(dst);
      callback(src, dst);
    } else {
      callback(src, dst);
    }
  });
};
// 新建目录
function mkdir(path, fn) {
  fs.mkdir(path, function (err) {
    fn && fn();
  });
}
