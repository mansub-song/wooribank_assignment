var http = require('http');
var fs = require('fs');

var querystring = require('querystring');
const {
    create,
    combine
} = require("./SSS")
const {
    sendEthTransaction
} = require("./sendTx")
const {
    decrypt
} = require("./decryption");


const password = 'Wooribank is good!';

const port1 = 3000;
const port2 = 3001;
const port3 = 3003;
const loginPort = 4000;

const loginTime = 10000
const txTime = 20000 //30seconds
const msg = '@'
const N = 3
const threshold = 2
const shares = new Array(N)
for (var i = 0; i < N; i++) {
    shares[i] = new Array(2)
}
var cipherText = ''

// const cipherText = '2883fd578b6551c1336e4e9d92afce4d:dcece1884a304c6cab83cdd9a54c7366513e1a7f44e477888e1665261478281e'; //Wooribank is good!
// const cipherText = '575e03a69688f60b8e41a0fb34284a5e:989b0f512b3c1e332670d0122395f2b7ca74ce7ce4c2ce39797113261ed6719b'; //Wooribank is good!!!


function logIn(cipherText) {
    const decryptResult = decrypt(cipherText)
    // console.log('decrypt result:', decryptResult)
    if (decryptResult != password) {
        console.log("password is not correct! exit!!")
        process.exit()
    } else {
        console.log("password is correct! Welcome to Wooribank!!!")
        initServer()
    }
}

http.createServer(function (req, res) {

    if (req.method == 'GET') {
        // console.log("GET")
        fs.readFile('./login.html', 'utf8', function (error, data) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.end(data);
        });
    } else if (req.method == 'POST') {
        req.on('data', function (chunk) {
            var data = querystring.parse(chunk.toString());
            cipherText = data.ciphertext;
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.end('sned!');
        });
    }

}).listen(loginPort, function () {
    console.log('loginPort is running...');
});








console.log("샤미르 비밀 공유 <x,y> 생성:")
const sharesCreate = create(msg, threshold, N)
console.log(sharesCreate, "\n생성완료\n\n")


console.log('로그인 제한시간 ', String(loginTime / 1000), '초');

setTimeout(() => {
    console.log(cipherText)

    logIn(cipherText)

}, loginTime);





console.log('트랜잭션 전송 제한시간 ', String(txTime / 1000), '초');
setTimeout(() => {

    console.log(shares)
    count = 0
    var tmpArr = new Array()

    for (var i = 0; i < N; i++) {
        if (shares[i][0] != null && shares[i][1] != null) {
            tmpArr[count] = shares[i]
            count++
        }
    }

    if (count >= threshold) {


        var decrypted_msg = combine(tmpArr)
        decrypted_msg = decrypted_msg.toString()
        if (msg == decrypted_msg) {
            console.log("sendTx!!")
            sendEthTransaction()
        }
    } else {
        console.log("count < threshold!! exit!!")
        process.exit()
    }
}, (txTime));



function initServer() {
    http.createServer(function (req, res) {

        if (req.method == 'GET') {
            // console.log("GET")
            fs.readFile('./sign.html', 'utf8', function (error, data) {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.end(data);
            });
        } else if (req.method == 'POST') {
            req.on('data', function (chunk) {
                var data = querystring.parse(chunk.toString());
                // console.log(data.x, data.y);
                shares[0][0] = data.x;
                shares[0][1] = data.y;
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.end('transaction signed');
            });
        }

    }).listen(port1, function () {
        console.log('Server1 is running...');
    });



    http.createServer(function (req, res) {

        if (req.method == 'GET') {
            // console.log("GET")
            fs.readFile('./sign.html', 'utf8', function (error, data) {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.end(data);
            });
        } else if (req.method == 'POST') {
            req.on('data', function (chunk) {
                var data = querystring.parse(chunk.toString());
                // console.log(data.x, data.y);
                shares[2][0] = data.x;
                shares[2][1] = data.y;
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.end('transaction signed');
            });
        }

    }).listen(port3, function () {
        console.log('Server3 is running...');
    });


    http.createServer(function (req, res) {

        if (req.method == 'GET') {
            // console.log("GET")
            fs.readFile('./sign.html', 'utf8', function (error, data) {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.end(data);
            });
        } else if (req.method == 'POST') {
            req.on('data', function (chunk) {
                var data = querystring.parse(chunk.toString());
                // console.log(data.x, data.y);
                shares[1][0] = data.x;
                shares[1][1] = data.y;
                // console.log(shares[1][0],shares[1][1]);
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.end('transaction signed');
            });
        }

    }).listen(port2, function () {
        console.log('Server2 is running...');
    });
}