

  document.addEventListener("DOMContentLoaded", function(event) {
    setEventListenerForSubmitButtons();
  });





function setEventListenerForSubmitButtons(){
    let buttonList = document.getElementById("js-submitbuttons").children;
    for (let button of buttonList) {
        button.addEventListener("click", () => {
            mathOperation(button.id);
        })
    }
}

function mathOperation(id){
    let x = document.getElementById("x").value;
    let y = document.getElementById("y").value;

    const responseOperation = {
        "+" : +x + +y,
        "-" : +x - +y,
        "concate": x + y,
        "cancel": "CANCEL",
    };

    if(responseOperation[id]=="CANCEL"){
        document.write(responseOperation[id]);
    }
    else{
        document.write(`${x} ${id} ${y} = ${responseOperation[id]}`);
    }
}