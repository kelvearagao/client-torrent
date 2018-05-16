var http = require('http');
var fs = require('fs');

var crypto = require('crypto')
  , shasum = crypto.createHash('sha1');

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function bin2string(array){
	var result = "";
	for(var i = 0; i < array.length; ++i){
		result+= (String.fromCharCode(array[i]));
	}
	return result;
}

function string2Bin(str) {
  var result = [];
  for (var i = 0; i < str.length; i++) {
    result.push(str.charCodeAt(i));
  }
  return result;
}

function toHex(s) {
    // utf8 to latin1
    var s = unescape(encodeURIComponent(s))
    var h = ''
    for (var i = 0; i < s.length; i++) {
        h += s.charCodeAt(i).toString(16)
    }
    return h
}

function decode(buf) {
    var buffer = Buffer.from(buf);

    var length = buffer.length;
    var cont = 0;
    var num = '';
    var int = '';
    var isIntSeq = false;
    var text = '';
    var contPieces = 0;
    var pieceBlock = ''; 
    var isPiecesSeq = false;
    var json = '';
    var isKey = true;
    while(cont < length) {
        // var ch = buffer.toString('utf8', cont, cont+1);
        var ch = buffer.slice(cont, cont+1).toString('utf8');
        
        if(ch == 'd') {
            json += '{';
        }

        if(ch == 'e' && isIntSeq == false) {
            json += '}';
        }

        if(ch == 'e' && isIntSeq == true) {
            json += '"'+ int +'", ';
            isKey = !isKey; 
            
            isIntSeq = false;
            int = '';
        }

        if(isIntSeq) {
            int += ch;
        }

        if(ch == 'i') {
            isIntSeq = true;
        }

        if(ch == ':') {
            text = buffer.toString('utf8').substring(cont + 1, cont + 1 + parseInt(num));

            if(isPiecesSeq) {
                var pbuf = buffer.slice(cont + 1, cont + 1 + parseInt(num));
                json += '[';
                for(var i = 0; i < pbuf.length; i += 20) {
                    //console.log(pbuf.slice(i, i + 20).toString('hex'));
                    //var hash = pbuf.slice(i, i + 20).toString('hex').toString();
                    var hash = encodeURIComponent(pbuf.slice(i, i + 20));

                    json += ' "'+hash+'" ';
                    
                    if((i + 20) < pbuf.length) {
                        json += ', ';
                    }
                }
                json += ']';
                isKey = !isKey;
            }

            if(!isPiecesSeq) {
                if(text == 'info') {
                    json += '"'+text+'":';
                    isKey = true;
                } else {
                    json += isKey ? '"' + text + '": ' : '"'+ text +'",';
                    isKey = !isKey;
                }
            }

            if(text == 'pieces') {
                isPiecesSeq = true;
            } 
            
            cont += parseInt(num);
            num = '';
            prevKey = text;
        }

        if(isNumeric(ch) && !isIntSeq) {
            num += ch;
        }

        cont++;
    }

    return JSON.parse(json);
}

function getInfoHash(buf) {
    var buffer = buf;
    var length = buffer.length;
    var cont = 0;
    var begin = buffer.indexOf('infod');
    //var ch = buffer.slice(begin + 4, begin + 4 +1).toString('utf8');
    var result = null;
    cont = begin + 4;
    while(cont < length) {
        var ch = buffer.slice(cont, cont+1).toString('utf8');
        //console.log(ch);
        if(ch == 'd') {
            //console.log('d');
        }
        else
        if(ch == 'i') {
            //console.log('-> i');
            var index = buffer.indexOf('e', cont);
            //console.log(buffer.slice(cont, index+1).toString('utf8'));
            cont = index;
        }
        else
        if('0123456789'.indexOf(ch) != -1) {
            //console.log('-> num');
            var index = buffer.indexOf(':', cont);
            var num = parseInt(buffer.slice(cont, index).toString('utf8'));
            var text = buffer.slice(cont, index + num + 1).toString('utf8');
            cont = index + num;
        }
        else
        if(ch == 'e') {
            //console.log('end');
            result = buffer.slice(begin + 4, cont + 1);
            //console.log('->',buffer.slice(begin + 4, cont + 1).toString('utf8'));
            break;
        }

        //console.log('->',buffer.slice(cont, cont+1).toString('utf8'));
        
        cont++;
    }

    return result;
}

function getInfoHashBuf(infoBuf) {
    var r1 = shasum.update(infoBuf);
    var hex = r1.digest('hex');
    var b1 = new Buffer(hex, "hex");

    return b1;
}

const dgram = require('dgram');
const client = dgram.createSocket('udp4');

var result = null;

fs.readFile('tt.torrent', function(err, buf) {
        //var result = decode(buf);

       result = getInfoHash(buf);

        

        //result.info.pieces.forEach(function(hash){
            //console.log('-->', (hash));
        //})
        //console.log(result);
});

function toUInt32 (n) {
    var buf = Buffer.allocUnsafe(4);
    buf.writeUInt32BE(n, 0);
    
    return buf;
}

function toInt32 (n) {
    var buf = Buffer.allocUnsafe(4);
    buf.writeInt32BE(n, 0);
    
    return buf;
}

function toUInt16 (n) {
  var buf = Buffer.allocUnsafe(2)
  buf.writeUInt16BE(n, 0)
  return buf
}

function toUInt64(n) {
    return Buffer.concat([toUInt32(0), toUInt32(n)]);
}

function getProtocolId() {
    return Buffer.concat([ toUInt32(0x417), toUInt32(0x27101980) ]);
}

function getActionConnect() {
    return toUInt32(0);
}

function getActionAnnounce() {
    return toUInt32(1);
}

function getTransactionId() {
    return crypto.randomBytes(4);
}

function getConnectionId(connectResponse) {
    return connectResponse.slice(8,16);
}

function getConnectMessage() {
    var message = Buffer.concat([
        getProtocolId(),
        getActionConnect(),
        getTransactionId()
    ]);

    /*
    console.log('connect ...');
    console.log('protocol id', message.slice(0,8).toString('hex'));
    console.log('action', message.slice(8,12).toString('hex'));
    console.log('transaction id', message.slice(12,16).toString('hex'));
    console.log('-----------------------------------------------------');
    */

    return message;
}

function getAnnouceMessage(connectResponse, buf) {
    //console.log(getConnectionId(connectResponse));
    // return;
    var message = Buffer.concat([
        getConnectionId(connectResponse),
        getActionAnnounce(), // 1
        getTransactionId(),
        getInfoHashBuf(getInfoHash(buf)),
        Buffer.from('01234567890123456789'), // peer id
        toUInt64(0), // downloaded
        toUInt64(2621048875), // left
        toUInt64(0), // uploaded
        toUInt32(0), // 0: none; 1: completed; 2: started; 3: stopped
        toUInt32(0), // ip address - optional - 0 default
        toUInt32(0), // key - optinal
        toInt32(-1), // num_want -1 default
        toUInt16(1337)        
    ]);

    return message;
}

function send(message) {
    client.send(message, 1337, 'tracker.opentrackr.org', (err, res) => {
        
    });
}

var message = getConnectMessage();

client.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
});

client.on('message', (response, rinfo) => {
    console.log(`server got from ${rinfo.address}:${rinfo.port} ...` );
    var action = response.slice(0, 4).toString('hex');
    console.log('action', action);
    
    if(action == '00000000') {
        console.log('--> connect');
        var msg = getAnnouceMessage(response, result);
        send(msg);
    }
    else if (action == '00000001') {
        console.log('--> announce response');
        var r = {
            action: response.readUInt32BE(0, 4),
            transactionId: response.readUInt32BE(4, 8),
            interval: response.readUInt32BE(8, 12),
            leechers: response.readUInt32BE(12, 16),
            seeders: response.readUInt32BE(16, 20),
            ipAddress: response.readUInt32BE(20, 24),
            tcpPort: response.readUInt16BE(24, 26),
        };

        console.log(response.length);
        console.log(r);
    }

    //console.log('transaction id', response.slice(4, 8).toString('hex'));
    //console.log('connection id', response.slice(8, 16).toString('hex'));
    //console.log('------------------------------------------------------');
});

client.send(message, 1337, 'tracker.opentrackr.org', (err, res) => {
    //console.log('send', err); 
    //console.log('res', res); 
});

