require('./check-versions')()

var chalk = require('chalk')
var path = require('path')
var readline = require('readline');
var exec = require('child_process').exec
var fs = require('fs')
var configs = JSON.parse(fs.readFileSync('settings.json'))

var dict = resolve(configs.deploy.qa.targetDist)
var serverDir = configs.deploy.qa.testServerDirectory
var servers = configs.deploy.qa.servers
let tips = "> 选择你要部署测试服务器\n"

servers.map((val, key) => {
	tips+= `${key+1}. ${val.host} \n`
})

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

function getCommandParams(label) {
    if (servers.length === 1) {
        return Promise.resolve(1);
    }
    return new Promise((res, rej) =>{
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(label, info => {
            rl.close()
            res(info)
        })
    })
}
getCommandParams(tips).then(res => {
    if(res > 0 && res <= servers.length) {
        getTestServerDirectory().then(data => {
            let index = !data ? 0 : data;
            let _serverDir = serverDir[index - 1].dir;
            let _url = `http://${servers[res-1].host}${serverDir[index - 1].pathname}`;

            console.log(chalk.yellow(`${servers[res-1].host} connecting....`))
            var scp = exec(`scp -r ${dict} ${servers[res-1].username}@${servers[res-1].host}:${_serverDir}`)

            scp.stderr.on('data', function(data) {
                console.log(data)
            });
            scp.on('close', function(code) {
                console.log('closing code: ' + code);
                if(code == 0) {
                    console.log(chalk.green(
                    `  Tip: Deployment is complete on the ${servers[res-1].host}`
                    ))

                    console.log(`  访问地址：${_url}`)
                }
            });
        });
    } else {
        console.log(chalk.red(`请选择已有的测试服务器！`))
    }

})



function getTestServerDirectory() {
    let tips = '\n> 选择部署目录，不选则默认default\n';

    serverDir.map((val, key) => {
    	tips+= `${key+1}. ${val.name} (${val.pathname}) \n`
    })

    return new Promise((res, rej) =>{
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(tips, info => {
            rl.close()
            res(info)
        })
    })
}
