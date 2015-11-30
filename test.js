var http=require('http');

console.log('test');
http.get({
                hostname: '128.199.213.139',
                port: 8001,
                path: '/firehose.json?num=1',
                agent: false  // create a new agent just for this one request
            }, function (res) {
              res.on('data', function(data){
                  console.log("Response"+res.statusCode);
                  console.log("Response"+data);
              })
            })

