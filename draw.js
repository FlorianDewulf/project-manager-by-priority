function Draw(canvas) {
    var that = this
    this.ctx = canvas.getContext('2d')
    this.center = { x: 0, y: 0 }
    
    function initialize (canvas) {
        // set the size
        canvas.height = document.body.clientHeight - 10
        canvas.width = document.body.clientWidth - 10
        that.center = { x: canvas.width / 2, y: canvas.height / 2 }
    }
    
    function angleToRadiant (a) {
        return a * Math.PI / 180
    }
    
    function angleToDeg (a) {
        console.log(a)
        return a * 180 / Math.PI
    }
    
    function calcAngle (coord, r) {
        if (coord.x < 0 && coord.y > 0) {           // first quarter            
            coord.x *= -1
            return 180 - angleToDeg(Math.acos(coord.x / r))
        } else if (coord.x < 0 && coord.y < 0) {    // second quarter
            coord.x *= -1
            coord.y *= -1
            return 180 + angleToDeg(Math.acos(coord.x / r))
        } else if (coord.x > 0 && coord.y < 0) {    // third quarter
            coord.y *= -1
            return 360 - angleToDeg(Math.acos(coord.x / r))
        } else {                                    // fourth quarter
            return angleToDeg(Math.acos(coord.x / r))
        }
    }

    this.drawArc = function (r, alphaBegin, alphaEnd, color) {
        this.ctx.beginPath()
        this.ctx.arc(this.center.x, this.center.y, r / 2, angleToRadiant(alphaBegin), angleToRadiant(alphaEnd), false)
        this.ctx.strokeStyle = color
        this.ctx.lineWidth = r
        this.ctx.stroke()
    }
    this.drawCircle = function (r, color) {
        this.drawArc(r, 0, TOTAL_CIRCLE_ANGLE, color)
    }
    this.draw = function (data) {
        for (let layer in data) {
            let initialAngle = 0
            for (let index in data[layer]) {
                let angle = (TOTAL_CIRCLE_ANGLE / data[layer].length)
                this.drawArc((data.length - layer + 1) * 100, initialAngle, initialAngle + angle, data[layer][index].color)
                initialAngle += angle
            }
        }
        this.drawCircle(100, '#0000FF')
    }
    this.findData = function (event, data) {
        // get the r
        r = Math.sqrt(Math.pow(event.x - this.center.x, 2) + Math.pow(event.y - this.center.y, 2))
        // Click in the center
        if (r < 100) {
            return null
        } else {
            // find the layer
            let layer = 0
            for (let min = 200 ; min < r ; min += 100) {
                ++layer
                if (r < min + 100) {
                    break
                }
            }
            // not on a layer
            if (data.length < layer + 1) {
                return null
            }
            // find the part of the circle
            let angle = calcAngle({ x: event.x - this.center.x, y: (event.y - this.center.y) * -1 }, r)
            let anglePerStack = 360 / data[layer].length
            for (let begin = 0, i = data[layer].length - 1 ; begin < angle ; begin += anglePerStack) {
                if (begin < angle && angle < begin + anglePerStack) {
                    return data[layer][i]
                }
                --i
            }
        }
        return null
    }

    initialize(canvas)
}