function addStone() {
    var index = imgArray.push(generateImage("images/stone.png")) - 1;
    stoneArray.push(index);
    generateAlarm(index);
}

function addMonster() {
    var index = imgArray.push(generateImage("images/monster.png")) - 1;
    monsterArray.push(index);
    imgArray[index].speed = 64;
    generateAlarm(index);
}

function completaCuadrado(obj) {
    var point = {
        "x": obj.x + obj.imagen.width,
        "y": obj.y + obj.imagen.height
    };
    return point;
}

function convertToBool(str) {
    if (str === "true") {
        return true;
    } else {
        return false;
    }
}

function generateAlarm(index) {
    imgArray[index].imagen.onload = function() {
        imgArray[index].ready = true;
    };
}

function generateCoor(obj) {
    var coor = {
        "x": obj.x,
        "y": obj.y
    };
    return coor
}

function generateImage(src) {
    var img = {
        "ready": false,
        "imagen": new Image(),
        "x": 0,
        "y": 0
    };
    img.imagen.src = src;
    return img;
};

function getTypeOfItem(obj) {
    var src = obj.imagen.src;
    return src.split("/")[4].split(".")[0];
}

function generatePosition(obj) {
    var pos = {};
    pos.x = Math.floor(32 + (Math.random() * (canvas.width - 64 - obj.imagen.width)));
    pos.y = Math.floor(32 + (Math.random() * (canvas.height - 64 - obj.imagen.height)));
    return pos;
}

function seSolapan(a1, a2, b1, b2) {
    if (((b1.y > a2.y) || (b2.y < a1.y)) || ((b1.x > a2.x) || (b2.x < a1.x))) {
        return false;
    } else {
        return true;
    }
}
