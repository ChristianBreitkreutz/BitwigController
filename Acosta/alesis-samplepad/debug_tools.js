function debug_print (text){
  if (debug_mode){
    println(text);
  }
}

function debug_print_midi (status, data1, data2){
  if (debug_mode){
  var print_text;
    if(status === 144) {
      print_text = "note on";
    }
    else if(status === 128) {
    print_text = "note off";
    }
    else {
    print_text = "statusCode: '" + status + "'";

    }

    println(print_text.concat(" ( key:"+ data1 + " – velocity: " + data2 + " )"));
  }
}

function debug_print_gridButton (row, column, pressed){
  if (debug_mode){

    println("row: "+ row +", column: "+ column +", pressed: "+ pressed);
  }
}
