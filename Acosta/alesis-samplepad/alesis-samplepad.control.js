loadAPI(1);

load("debug_tools.js");
var debug_mode = true;

host.defineController("acosta", "alesis-samplepad", "1.0","c8c89536-e594-48d6-9731-c5bec36f3376");
host.defineMidiPorts(1, 0);


var trackBank;
var note_already_used;
var triggerGroups  = [
			{
				track_number: 0,
				notes: [ 49, 53 ]
			},
			{
				track_number: 1,
				notes: [ 48, 47, 51 ]
			},
			{
				track_number: 2,
				notes: [ 37, 71, 43 ]
			}
		];
//------------------------------------ Init -----------------------------------//
function init() {
    debug_print("init.");

    var midiIn = host.getMidiInPort(0)
    debug_print("bind midi callback function: 'onMidi'");
		midiIn.setMidiCallback(onMidi);
		trackBank = host.createTrackBankSection(3,0,3)

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

function onMidi(status, key_number, velocity) {
	debug_print_midi(status, key_number, velocity);
	if(status === 144 || (status === 145 && velocity > 0)){
		clip_coordinates = get_clip_coordinates (key_number)

		if(note_already_used[key_number]){
			reset_group(key_number)
			debug_print("toogel off – key: "+key_number+" – track_number: "+clip_coordinates.track_number+" – slot_number: "+ clip_coordinates.slot_number)
			trackBank.getTrack (clip_coordinates.track_number).stop()
		}else{
			rebuild_group(key_number)
			debug_print("toogel on – key: "+key_number+" – track_number: "+clip_coordinates.track_number+" – slot_number: "+ clip_coordinates.slot_number)
			trackBank.getTrack(clip_coordinates.track_number).getClipLauncherSlots().launch(clip_coordinates.slot_number)
		}
	}
}

function exit() {
	debug_print("exit.");
}
