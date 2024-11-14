function main() {
    const canvas = document.querySelector("#canvas");
    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
  
    if (!gl) {
        throw new Error('WebGL not supported');
    }
  
    var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
    var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;
  
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  
    var program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);
  
    const positionBuffer = gl.createBuffer();
    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  
    const matrixUniformLocation = gl.getUniformLocation(program, 'matrix');
    const colorUniformLocation = gl.getUniformLocation(program, 'color');
    const pointSizeUniformLocation = gl.getUniformLocation(program, 'Size');

    let SizeValue = 5.0;
    gl.uniform1f(pointSizeUniformLocation, SizeValue);
  
    let matrix = [
        2 / canvas.width, 0, 0, 0,
        0, -2 / canvas.height, 0, 0,
        0, 0, 0, 0,
        -1, 1, 0, 1
    ];
    gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);
  
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    let points = [];
    let aux = [];
    let colorVector = [0.0, 0.0, 0.0];
    let lineWidth = 1;
  
    canvas.addEventListener("mousedown", mouseClick, false);
    document.querySelector("body").addEventListener("keydown", keyDown, false);
    document.querySelector("body").addEventListener("keydown", setLineWidth, false);
  
    function mouseClick(event) {
        const positionVector = [event.offsetX, event.offsetY];
        points.push(positionVector);
        

        if (shape === 'r' && points.length === 2) {
            gl.clear(gl.COLOR_BUFFER_BIT);
            ColorChange = false;
            ChangeSize = false;
            drawLine(points[0][0], points[0][1], points[1][0], points[1][1]);
            aux = points;
            points = []; 
        } 
        else if (shape === 't' && points.length === 3) {
            gl.clear(gl.COLOR_BUFFER_BIT);
            ColorChange = false;
            ChangeSize = false; 
            drawTriangle(points[0][0], points[0][1], points[1][0], points[1][1], points[2][0], points[2][1]);
            aux = points;
            points = [];
        }
    }
  
    function drawLine(x1, y1, x2, y2) {
        gl.lineWidth(lineWidth);
        let dx = Math.abs(x2 - x1);
        let dy = Math.abs(y2 - y1);
        let sx = (x1 < x2) ? 1 : -1;
        let sy = (y1 < y2) ? 1 : -1;
        let err = dx - dy;
  
        while (true) {
            drawPoint(x1, y1);
            if (x1 === x2 && y1 === y2) break;
            let err2 = err * 2;
            if (err2 > -dy) {
                err -= dy;
                x1 += sx;
            }
            if (err2 < dx) {
                err += dx;
                y1 += sy;
            }
        }
    }
  
    function drawTriangle(x1, y1, x2, y2, x3, y3) {
        gl.uniform3fv(colorUniformLocation, colorVector);
        drawLine(x1, y1, x2, y2);
        drawLine(x1, y1, x3, y3);
        drawLine(x2, y2, x3, y3);
    }
  
    function drawPoint(x, y) {
        const positionVector = [x, y];
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionVector), gl.STATIC_DRAW);
        gl.uniform3fv(colorUniformLocation, colorVector);
        gl.drawArrays(gl.POINTS, 0, 1);
    }

    

    function keyDown(event) {

        if (event.key.toLowerCase() === 'r') {
            shape = 'r'; 
        } 
        else if (event.key.toLowerCase() === 't') {
            shape = 't'; 
        }
        if (event.key.toLowerCase() === 'e') {
            ColorChange = true;
            ChangeSize = false;
            return;
        }
        if (event.key.toLowerCase() === 'k') {
            ColorChange = false;  
            ChangeSize = true;    
            return;
        }

        if (ColorChange) {
            switch (event.key) {
                case "0": colorVector = [0.0, 0.0, 0.0]; break;
                case "1": colorVector = [1.0, 0.0, 0.0]; break;
                case "2": colorVector = [0.0, 1.0, 0.0]; break;
                case "3": colorVector = [0.0, 0.0, 1.0]; break;
                case "4": colorVector = [1.0, 1.0, 0.0]; break;
                case "5": colorVector = [0.0, 1.0, 1.0]; break;
                case "6": colorVector = [1.0, 0.0, 1.0]; break;
                case "7": colorVector = [1.0, 0.5, 0.5]; break;
                case "8": colorVector = [0.5, 1.0, 0.5]; break;
                case "9": colorVector = [0.5, 0.5, 1.0]; break;
                default: return;
            }
            if (shape === 'r' && aux.length === 2) {
                gl.clear(gl.COLOR_BUFFER_BIT);
                drawLine(aux[0][0], aux[0][1], aux[1][0], aux[1][1]);
            } 
            else if (shape === 't' && aux.length === 3) {
                gl.clear(gl.COLOR_BUFFER_BIT);
                drawTriangle(aux[0][0], aux[0][1], aux[1][0], aux[1][1], aux[2][0], aux[2][1]);
            }
        }
            if (ChangeSize) {
                switch (event.key) {
                    case "1": SizeValue = 1; break;
                    case "2": SizeValue = 2; break;
                    case "3": SizeValue = 3; break;
                    case "4": SizeValue = 4; break;
                    case "5": SizeValue = 5; break;
                    case "6": SizeValuee = 6; break;
                    case "7": SizeValue = 7; break;
                    case "8": SizeValue = 8; break;
                    case "9": SizeValue = 9; break;
                    default: return;
                }
            gl.uniform1f(pointSizeUniformLocation, SizeValue);
            if (shape === 'r' && aux.length === 2) {
                gl.clear(gl.COLOR_BUFFER_BIT);
                drawLine(aux[0][0], aux[0][1], aux[1][0], aux[1][1]);
            } 
            else if (shape === 't' && aux.length === 3) {
                gl.clear(gl.COLOR_BUFFER_BIT);
                drawTriangle(aux[0][0], aux[0][1], aux[1][0], aux[1][1], aux[2][0], aux[2][1]);
            }
            }
    
    }
}

    
  
  function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
  
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }
  
  function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
  
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }
  
  main();