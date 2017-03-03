var save_button = document.getElementById("save_button");
save_button.addEventListener("click", function(e) {
    localStorage.setItem("saved_princess", princessesCaught);
    localStorage.setItem("items", JSON.stringify(imgArray));
    localStorage.setItem("stones", JSON.stringify(stoneArray));
    localStorage.setItem("monster", JSON.stringify(monsterArray));
    localStorage.setItem("killed", killed);
    setVisibility(delete_button,true);
    setVisibility(load_button,true);
});

var load_button = document.getElementById("load_button");
setVisibility(load_button,localStorage.length !== 0);
load_button.addEventListener("click", function(e) {
    localStorage.setItem("load_saved_state", true);
    reload();
});

var delete_button = document.getElementById("delete_button");
setVisibility(delete_button,localStorage.length !== 0)
delete_button.addEventListener("click", function(e) {
    localStorage.clear();
    setVisibility(delete_button,false);
    setVisibility(load_button,false);
});

function load_state() {
    if (localStorage.getItem("saved_princess") != null) {
        princessesCaught = localStorage.getItem("saved_princess");
    }
    if (localStorage.getItem("stones") != null) {
        stoneArray = JSON.parse(localStorage.getItem("stones"));
        for (i in stoneArray) {
            imgArray[stoneArray[i]] = generateImage("images/stone.png");
            generateAlarm(stoneArray[i]);
        }
    }
    if (localStorage.getItem("monster") != null) {
        monsterArray = JSON.parse(localStorage.getItem("monster"));
        for (i in monsterArray) {
            imgArray[monsterArray[i]] = generateImage("images/monster.png");
            generateAlarm(monsterArray[i]);
        }
    }
    if (localStorage.getItem("items") != null) {
        var aux = JSON.parse(localStorage.getItem("items"));
        imgArray[HERO].speed = aux[HERO].speed;
        for (i in aux) {
            imgArray[i].x = aux[i].x;
            imgArray[i].y = aux[i].y;
            if (getTypeOfItem(imgArray[i]) === "monster") {
                imgArray[i].speed = aux[i].speed;
            }
        }
    }
    if (localStorage.getItem("killed") != null) {
        killed = convertToBool(localStorage.getItem("killed"));
    }
}

function reload() {
    var div_cvs = document.getElementById("cvs");
    div_cvs.innerHTML = "";
    keysDown = {};
    game();
}

function setVisibility(button, visible){
    if(visible){
        button.classList.remove("invisible");
        button.classList.add("visible");
    }else{
        button.classList.remove("visible");
        button.classList.add("invisible");
    }
}
