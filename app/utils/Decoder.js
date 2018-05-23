

export default class Decoder {

	static decodeString(buffer, begin, isList = false) {
		var listEnd = isList ? 1 : 0;
		var index = parseInt(buffer.indexOf(':', begin));
        var num = parseInt(buffer.slice(begin, index).toString('utf8'));
        var b = buffer.slice(index + 1, index + num + 1);
        var text = b.toString('utf8');

        //console.log(text);

        begin = index + num + listEnd;

        return {
        	cont: begin,
        	value: text
        };
	}

	/*static getType(key) {
		if(['announce', 'announce list', 'length', ])
	}*/

	static decodeInteger(buffer, begin) {
		var index = buffer.indexOf('e', begin);
		var text = buffer.slice(begin + 1, index).toString('utf8');
	    begin = index;

	    //console.log(text);

        return {
        	cont: begin,
        	value: text
        };
	}

	static decodeList(buffer, cont) {
		var elements = [];
		while(cont < buffer.length) {
			var ch = buffer.slice(cont, cont+1).toString('utf8');

			if('0123456789'.indexOf(ch) != -1) {
				var state = this.decodeString(buffer, cont, true);
				state.type = 'itemList';
				elements.push(state);
	            cont = state.cont;
	        }
	        else
	        if(ch == 'e') {
	        	return {
	        		cont: cont,
	        		value: elements,
	        		isKey: false
	        	}
	        }

	        cont++;
		}
	}

	static decode(buf) {
		var elements = [];
	    var buffer = buf;
	    var length = buffer.length;
	    var cont = 0;
	    var begin = buffer.indexOf('infod');
	    //var ch = buffer.slice(begin + 4, begin + 4 +1).toString('utf8');
	    var result = null;
	    cont = begin + 4;

	    cont = 0;
	    while(cont < length) {
	        var ch = buffer.slice(cont, cont+1).toString('utf8');
	        if(ch == 'd') {
	            elements.push({value: '{'});
	        }
	        else
	        if(ch == 'i') {
	        	var state = this.decodeInteger(buffer, cont);
	        	state.isKey = false;
	        	elements.push(state);
	            cont = state.cont;
	        }
	        else
	        if(ch == 'l') {
	        	elements.push({value: '['});
	        	
	        	var state = this.decodeList(buffer, cont);

	        	state.value.forEach((v) => {
	        		elements.push(v);	
	        	});
	        	
	        	cont = state.cont;
	        	elements.push({value: ']'});
	        }
	        else
	        if('0123456789'.indexOf(ch) != -1) {
	        	var state = this.decodeString(buffer, cont);
	        	
	        	if(elements[elements.length - 1] != undefined && elements[elements.length - 1].value == 'pieces') {
	        		state.value = 'Deve ser escapado!';
	        	}

	        	state.isKey = elements[elements.length - 1].isKey ? false : true;
	        	elements.push(state);	        	
	            cont = state.cont;
	        }
	        else
	        if(ch == 'e') {
	         	elements.push({value: '}'});   
	            //result = buffer.slice(begin + 4, cont + 1);
	            //console.log('->',buffer.slice(begin + 4, cont + 1).toString('utf8'));
	            //break;
	        }

	        //console.log('->',buffer.slice(cont, cont+1).toString('utf8'));
	        
	        cont++;
	    }

	    return elements;
	}

	static createStr(elements) {
		var str = "";
		elements.forEach((e, index) => {
			if(e.isKey) {
				str += '"' + e.value + '":';
			} else if("{[".indexOf(e.value) != -1) {
				str += e.value;
			} else if("}]".indexOf(e.value) != -1) {
				str += e.value;

				if (elements[index + 1] != undefined && ("}]".indexOf(elements[index + 1].value) == -1)) {
					str += ',';
				}
			} else if(e.isKey == false) {
				str += '"'+e.value+'"';

				if (elements[index + 1] != undefined && ("}]".indexOf(elements[index + 1].value) == -1)) {
					str += ',';
				}
			} else if(e.type == 'itemList') {
				str += '"'+e.value+'"';

				if (elements[index + 1] != undefined && ("}]".indexOf(elements[index + 1].value) == -1)) {
					str += ',';
				}
			}
		});

		return str;
	}

	static createObj(elements) {
		var result = this.createStr(elements);
		console.log(result);
		return JSON.parse(result);
	}

}