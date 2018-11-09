onload = function(){
    var EMO = new Array('smile','laugh','wink','sad','crying','surprised','smug','kiss','heart','fear','scream','ghost');
    var emo_length = EMO.length;
    var dir = '/Users/saito/Documents/work/emoji/data/out/';
    var texture0 = null, texture1 = null, texture2 = null, texture3 = null,
    texture4 = null, texture5 = null, texture6 = null, texture_a1 = null,
    texture_a2 = null, texture_b1 = null, texture_b2 = null, texture_b3 = null;

    var c = document.getElementById('canvas');
    c.width = 1280;
    c.height = 720;

    var gl = c.getContext('webgl') || c.getContext('experimental-webgl');

    var textCanvas = document.getElementById("text");
    textCanvas.width = 1280;
    textCanvas.height = 720;
    var ctx = textCanvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.font = "120px 'arial black'";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx_x = 640;
    ctx_y = 0;

    var v_shader = create_shader('vs');
    var f_shader = create_shader('fs');
    var prg = create_program(v_shader, f_shader);

    var attLocation = new Array();
    attLocation[0] = gl.getAttribLocation(prg, 'position');
    attLocation[1] = gl.getAttribLocation(prg, 'color');
    attLocation[2] = gl.getAttribLocation(prg, 'textureCoord');

    var attStride = new Array();
    attStride[0] = 3;
    attStride[1] = 4;
    attStride[2] = 2;

    var position = [
        -1.0,  1.0,  0.0,
         1.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
         1.0, -1.0,  0.0
    ];
    var color = [
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0
    ];
    var textureCoord = [
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        1.0, 1.0
    ];
    var index = [
        0, 1, 2,
        3, 2, 1
    ];

    var vPosition     = create_vbo(position);
    var vColor        = create_vbo(color);
    var vTextureCoord = create_vbo(textureCoord);
    var VBOList       = [vPosition, vColor, vTextureCoord];
    var iIndex        = create_ibo(index);
    set_attribute(VBOList, attLocation, attStride);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iIndex);

    var uniLocation = new Array();
    uniLocation[0]  = gl.getUniformLocation(prg, 'mvpMatrix');
    uniLocation[1]  = gl.getUniformLocation(prg, 'texture');

    var m = new matIV();
    var mMatrix   = m.identity(m.create());
    var vMatrix   = m.identity(m.create());
    var pMatrix   = m.identity(m.create());
    var tmpMatrix = m.identity(m.create());
    var mvpMatrix = m.identity(m.create());

    m.lookAt([0.0, 0.0, 7.0], [0, 0, 0], [0, 1, 0], vMatrix);
    m.perspective(45, c.width / c.height, 0.1, 100, pMatrix);
    m.multiply(pMatrix, vMatrix, tmpMatrix);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.activeTexture(gl.TEXTURE0);
    for (var i=0; i<EMO.length; i++) {
        create_texture(dir+EMO[i]+'.png?'+String(Math.random(1)),i);
    }

    var next_tex = null;
    var next_emo = null;

    var X = new Array(-3,-1,1,3,-1,1,3);
    var Y = new Array(0.5,0.5,0.5,0.5,-1.5,-1.5,-1.5);
    for (var i=0; i<7; i++){
      X[i] = X[i]*1.2
      Y[i] = Y[i]*1.16
    }

    var event_limit = 210;
    var anime_timer = null;
    var count = 0;
    var anime = false;
    var event = 0;
    var event_pos1 = [new Array(event_limit),new Array(event_limit)];
    var event_rot1 = new Array(event_limit);
    var event_scl1 = [new Array(event_limit),new Array(event_limit)];
    var event_pos2 = [new Array(event_limit),new Array(event_limit)];
    var event_scl2 = [new Array(event_limit),new Array(event_limit)];

    var update = function() {
        gl.flush();
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.BLEND);

        ctx.fillText("E M O - i",ctx_x,ctx_y);

        gl.bindTexture(gl.TEXTURE_2D, texture0);
        gl.uniform1i(uniLocation[1], 0);
        render([X[0],Y[0],0]);
        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.bindTexture(gl.TEXTURE_2D, texture1);
        gl.uniform1i(uniLocation[1], 0);
        render([X[1],Y[1],0]);
        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.bindTexture(gl.TEXTURE_2D, texture2);
        gl.uniform1i(uniLocation[1], 0);
        render([X[2],Y[2],0]);
        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.bindTexture(gl.TEXTURE_2D, texture3);
        gl.uniform1i(uniLocation[1], 0);
        render([X[3],Y[3],0]);
        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.bindTexture(gl.TEXTURE_2D, texture4);
        gl.uniform1i(uniLocation[1], 0);
        render([X[4],Y[4],0]);
        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.bindTexture(gl.TEXTURE_2D, texture5);
        gl.uniform1i(uniLocation[1], 0);
        render([X[5],Y[5],0]);
        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.bindTexture(gl.TEXTURE_2D, texture6);
        gl.uniform1i(uniLocation[1], 0);
        render([X[6],Y[6],0]);
        gl.bindTexture(gl.TEXTURE_2D, null);

        if (anime) {
            switch(event){
                case 1: event1(); break;
                case 2: event2(); break;
                default: break;
            }
            count++;
        }

        if (count>=event_limit && anime_timer!=null){
            count = 0;
            anime = false;
            create_texture(next_tex,next_emo)
            clearInterval(anime_timer);
        }

        function render(trans){
      			m.identity(mMatrix);
      			m.translate(mMatrix, trans, mMatrix);
      			m.multiply(tmpMatrix, mMatrix, mvpMatrix);
      			gl.uniformMatrix4fv(uniLocation[0], false, mvpMatrix);
      			gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);
    		}
    };


    function event1() {
        gl.bindTexture(gl.TEXTURE_2D, texture_a1);
        gl.uniform1i(uniLocation[1], 0);
        m.identity(mMatrix);
        m.translate(mMatrix,[event_pos1[0][count],event_pos1[1][count],0],mMatrix);
        m.rotate(mMatrix,event_rot1[count],[0,0,1],mMatrix);
        m.multiply(tmpMatrix,mMatrix,mvpMatrix);
        gl.uniformMatrix4fv(uniLocation[0],false,mvpMatrix);
        gl.drawElements(gl.TRIANGLES,index.length,gl.UNSIGNED_SHORT, 0);
        gl.bindTexture(gl.TEXTURE_2D,null);

        gl.bindTexture(gl.TEXTURE_2D,texture_a2);
        gl.uniform1i(uniLocation[1], 0);
        m.identity(mMatrix);
        m.translate(mMatrix, [event_pos2[0][count],event_pos2[1][count],0], mMatrix);
        m.scale(mMatrix,[event_scl2[0][count],event_scl2[1][count],1],mMatrix);
        m.multiply(tmpMatrix, mMatrix, mvpMatrix);
        gl.uniformMatrix4fv(uniLocation[0], false, mvpMatrix);
        gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    function event2() {
        if (count<165) {
            gl.bindTexture(gl.TEXTURE_2D, texture_b1);
        } else {
            gl.bindTexture(gl.TEXTURE_2D, texture_b2);
        }
        gl.uniform1i(uniLocation[1], 0);
        m.identity(mMatrix);
        m.translate(mMatrix,[event_pos1[0][count],event_pos1[1][count],0],mMatrix);
        m.scale(mMatrix,[event_scl1[0][count],event_scl1[1][count],1],mMatrix);
        m.multiply(tmpMatrix,mMatrix,mvpMatrix);
        gl.uniformMatrix4fv(uniLocation[0],false,mvpMatrix);
        gl.drawElements(gl.TRIANGLES,index.length,gl.UNSIGNED_SHORT, 0);
        gl.bindTexture(gl.TEXTURE_2D,null);

        gl.bindTexture(gl.TEXTURE_2D,texture_b3);
        gl.uniform1i(uniLocation[1], 0);
        m.identity(mMatrix);
        m.translate(mMatrix,[event_pos2[0][count],event_pos2[1][count],0], mMatrix);
        m.scale(mMatrix,[event_scl2[0][count],event_scl2[1][count],1],mMatrix);
        m.multiply(tmpMatrix, mMatrix, mvpMatrix);
        gl.uniformMatrix4fv(uniLocation[0], false, mvpMatrix);
        gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    function event1_ready() {
        for(var i=0; i<event_limit; i++) {
            if (i<105) {
                var p = Math.min(i/75,1);
                event_pos1[0][i] = X[0]-2.5*(1-p);
                event_pos1[1][i] = Y[4];
                event_rot1[i] = -2*Math.PI*p
            } else {
                var p = Math.min((i-105)/75,1);
                event_pos1[0][i] = X[0]-2.5*p;
                event_pos1[1][i] = Y[4];
                event_rot1[i] = 2*Math.PI*p;
            }
            if (i>=75) {
                var q = Math.min((i-75)/75,1);
                event_pos2[0][i] = -3*(1-q)+X[next_emo]*q;
                event_pos2[1][i] = -2.2*(1-q)+Y[next_emo]*q;
                event_scl2[0][i] = (q+0.1)*1.5;
                event_scl2[1][i] = (q+0.1)*1.5;
            } else {
                event_pos2[0][i] = 0;
                event_pos2[1][i] = 0;
                event_scl2[0][i] = 0;
                event_scl2[1][i] = 0;
            }
        }
    }

    function event2_ready() {
        for (var i=0; i<event_limit; i++) {
            if (i<165) {
                event_scl1[0][i] = 1;
                event_scl1[1][i] = 1;
                event_scl2[0][i] = 1;
                event_scl2[1][i] = 1;
            }
            if (i<45) {
                var p = i/45;
                event_pos1[0][i] = -7+15*p;
                event_pos1[1][i] = Y[0];
                event_pos2[0][i] = -9+15*p;
                event_pos2[1][i] = Y[0];
            } else if (i<90) {
                var p = (i-45)/45;
                event_pos1[0][i] = 7-15*p;
                event_pos1[1][i] = Y[4];
                event_pos2[0][i] = 9-15*p;
                event_pos2[1][i] = Y[4];
            } else {
                var p = Math.min((i-90)/75,1);
                event_pos1[0][i] = 7*(1-p)+X[next_emo]*p;
                event_pos1[1][i] = Y[next_emo];
                if (i<165) {
                    event_pos2[0][i] = -7
                    event_pos2[1][i] = 0
                } else {
                    var q = Math.min((i-165)/30,1);
                    event_pos2[0][i] = -7*(1-q)+X[next_emo]*q;
                    event_pos2[1][i] = Y[next_emo];
                    if (i<195) {
                        var l = (i-165)/30;
                        event_scl1[0][i] = 1;
                        event_scl1[1][i] = 1;
                        event_scl2[0][i] = 1+1*l;
                        event_scl2[1][i] = 1+1*l;
                    } else {
                        var l = 1-(i-195)/15;
                        event_scl1[0][i] = l;
                        event_scl1[1][i] = l;
                        event_scl2[0][i] = 2*l;
                        event_scl2[1][i] = 2*l;
                    }
                }
            }
        }
    }

    function create_shader(id){
        var shader;
        var scriptElement = document.getElementById(id);
        if(!scriptElement){return;}
        switch(scriptElement.type){
            case 'x-shader/x-vertex':
                shader = gl.createShader(gl.VERTEX_SHADER);
                break;
            case 'x-shader/x-fragment':
                shader = gl.createShader(gl.FRAGMENT_SHADER);
                break;
            default :
                return;
        }
        gl.shaderSource(shader, scriptElement.text);
        gl.compileShader(shader);
        if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            return shader;
        }else{
            alert(gl.getShaderInfoLog(shader));
        }
    }

    function create_program(vs, fs){
        var program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if(gl.getProgramParameter(program, gl.LINK_STATUS)){
            gl.useProgram(program);
            return program;
        }else{
            alert(gl.getProgramInfoLog(program));
        }
    }

    function create_vbo(data){
        var vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return vbo;
    }

    function set_attribute(vbo, attL, attS){
        for(var i in vbo){
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
            gl.enableVertexAttribArray(attL[i]);
            gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
        }
    }

    function create_ibo(data){
        var ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return ibo;
    }

    function create_texture(source,num){
        var img = new Image();
        img.onload = function(){
            var tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
            switch(num){
        				case 0: texture0 = tex; break;
        				case 1: texture1 = tex; break;
                case 2: texture2 = tex; break;
                case 3: texture3 = tex; break;
                case 4: texture4 = tex; break;
                case 5: texture5 = tex; break;
                case 6: texture6 = tex; break;
                case 7: texture_a1 = tex; break;
                case 8: texture_a2 = tex; break;
                case 9: texture_b1 = tex; break;
                case 10: texture_b2 = tex; break;
                case 11: texture_b3 = tex; break
        				default: break;
      			}
            emo_length--;
            if (emo_length==0) {
                update();
            }
        };
        img.src = source;
    }

    var chokidar = require('chokidar')
    var watcher = chokidar.watch('/Users/saito/Documents/work/emoji/data/out/', {
      	ignored: /[\/\\]\./,
      	persistent:true
    })

    watcher.on('ready', function() {})
      	.on('add', function(path) {})
      	.on('addDir', function(path) {})
      	.on('unlink', function(path) {})
      	.on('unlinkDir', function(path) {})
      	.on('change', function(path) {
            var emo = path.split("/")
            emo = emo[emo.length-1].split(".")[0];
            var num = EMO.indexOf(emo);
            if (num==-1) {return;}
            emo_length++;
            next_tex = path+'?'+String(Math.random(1));
            next_emo = num;
            anime = true;
            console.log('changed '+EMO[next_emo]);
            event = Math.ceil(2*Math.random());
            switch(event) {
                case 1: event1_ready(); break;
                case 2: event2_ready(); break;
                default: break;
            }
            anime_timer = setInterval(update,1000/30);
            // create_texture(path+'?'+String(Math.random(1)),num);
        })
      	.on('error', function(error) {});

    };
