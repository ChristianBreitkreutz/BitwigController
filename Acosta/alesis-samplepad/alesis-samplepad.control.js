loadAPI(1);

load("debug_tools.js");
var debug_mode = false;

host.defineController("acosta", "alesis-samplepad", "1.0","c8c89536-e594-48d6-9731-c5bec36f3376");
host.defineMidiPorts(1, 0);


var trackBank;
var note_already_used;
var triggerGroups  = [
			{
				track_number: 0,
				notes: [ 105, 107, 108 ]
			},
			{
				track_number: 1,
				notes: [ 102, 104, 106 ]
			}
		];
//------------------------------------ Init -----------------------------------//
function init() {
    debug_print("init.");

    var midiIn = host.getMidiInPort(0)
    debug_print("bind midi callback function: 'onMidi'");
		midiIn.setMidiCallback(onMidi);
		trackBank = host.createTrackBankSection(2,0,3)

    note_already_used = initArray(false, 128);

}
function get_clip_coordinates (key_number){
  coordinates = {track_number: 0, slot_number: 0}
	for(i=0; i < triggerGroups.length; i++ ){
		for(n=0; n < triggerGroups[i].notes.length; n++ ){
			if(triggerGroups[i].notes[n] === key_number){
				coordinates.track_number = triggerGroups[i].track_number
				coordinates.slot_number = n
			}
		}
	}
	return coordinates
}
function reset_group(key_number){
	for(i=0; i < triggerGroups.length; i++ ){
		for(n=0; n < triggerGroups[i].notes.length; n++ ){
			if(triggerGroups[i].notes[n] === key_number){
				for(o=0; o < triggerGroups[i].notes.length; o++ ){
					note_already_used[triggerGroups[i].notes[o]] = false
				}
				return;
			}
		}
	}
}

function rebuild_group(key_number){
	for(i=0; i < triggerGroups.length; i++ ){
		for(n=0; n < triggerGroups[i].notes.length; n++ ){
			if(triggerGroups[i].notes[n] === key_number){
				for(o=0; o < triggerGroups[i].notes.length; o++ ){
					if(triggerGroups[i].notes[o] === key_number){
						note_already_used[triggerGroups[i].notes[o]] = true
					}else{
						note_already_used[triggerGroups[i].notes[o]] = false
					}
				}
				return;
			}
		}
	}
}

function onMidi(status, data1, data2) {
	debug_print_midi(status, data1, data2);
	track_number = 0
	slot_number = 0
	if(status === 144){
		coordinates = get_clip_coordinates (data1)
		track_number = coordinates.track_number
		slot_number = coordinates.slot_number

		if(note_already_used[data1]){
			reset_group(data1)
			debug_print("toogel off – key: "+data1+" – track_number: "+track_number+" – slot_number: "+ slot_number)
			trackBank.getTrack (track_number).stop()
		}else{
			rebuild_group(data1)
			debug_print("toogel on – key: "+data1+" – track_number: "+track_number+" – slot_number: "+ slot_number)
			trackBank.getTrack(track_number).getClipLauncherSlots().launch(slot_number)
		}
	}
}

function exit() {
	debug_print("exit.");
}
