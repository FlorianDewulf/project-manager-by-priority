document.addEventListener('DOMContentLoaded', function () {
    // Initialize the const
    Object.defineProperty(typeof global === "object" ? global : window, "TOTAL_CIRCLE_ANGLE", {
        value:        360,
        enumerable:   true,
        writable:     false,
        configurable: false
    })

    // Get elements we need
    let layers = document.getElementById('layers')
    let task = document.getElementById('task')
    let description = document.getElementById('description')
    let selectedColor = document.getElementById('selectedColor')
    let addLayer = document.getElementById('addLayer')
    let form = document.querySelector('.edit-window')
    // init values
    let tempo = null
    let data = []
    let colorValue = 'FFFFFF'
    let isColorPickerToggle = false
    let drawObject = new Draw(document.getElementById('canvas'))

    ColorPicker(
        document.getElementById('color'),
        document.getElementById('slider'),
        function(hex, hsv, rgb) {
            document.getElementById('selectedColor').style.background = hex
            colorValue = hex
            if (tempo) {
                clearTimeout(tempo)
            }
            tempo = setTimeout(toggleColorPicker, 200)
        }
    )

    function submit(e) {
        if (colorValue.length === 7 && task.value.length > 0) {
            let obj = {
                color: colorValue,
                task: task.value,
                description: description.value
            }
            if (layers.value === "new_layer") {
                let node = document.createElement("option")
                node.value = data.length + 1
                node.appendChild(document.createTextNode('Layer n°' + (data.length + 1)))
                layers.appendChild(node)
                data.unshift([ obj ])
            } else {
                data[data.length - parseInt(layers.value)].push(obj)
            }
            drawObject.draw(data)
            task.value = ''
            description.value = ''
        }
        return false
    }

    function toggleColorPicker () {
        document.getElementById('colorpickerBlock').style.display = isColorPickerToggle ? 'none' : 'block'
        isColorPickerToggle = !isColorPickerToggle
    }

    /*
     * Draggable window
     */
    var draggableWindow = null;    
    document.onmousemove = function(e) {
        if (draggableWindow) {
            draggableWindow.style.top = e.pageY + 'px'
            draggableWindow.style.left = e.pageX + 'px'
        }
    };
    document.querySelector('.header-window').onmousedown = function (e) {
        draggableWindow = e.target.parentNode;
    };
    document.onmouseup = function (e) {
        draggableWindow = null;
    };

    // initial draw
    drawObject.draw(data)

    // bindings
    selectedColor.onclick = toggleColorPicker
    addLayer.onclick = submit
    task.onsubmit = submit
    form.onsubmit = submit
    document.getElementById('canvas').onclick = function (e) {
        let dataFound = drawObject.findData(e, data)

        if (dataFound) {
            console.log(dataFound)
            document.getElementById('detail').style.display = 'block'
            document.querySelector('#detail h3').textContent = dataFound.task
            document.querySelector('#detail p').textContent = dataFound.description
        } else {
            document.getElementById('detail').style.display = 'none'
        }
    }
}, false)