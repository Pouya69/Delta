const roman_dialogue_text = "\\Roman: AHHH THAT'S TOO BRIGHT\n\\Telvy Phil: I'm sorry. Cameron told me you're here and he gave me this flashlight.\n\\Roman: Oh... Cameron's ALIVE?!\n\\Telvy Phil: Oh yeah. Without his flashlight I wouldn't be able to get to you.\nWhy do you ask?\nWhat happened here?!\nHe told me you may know more about what happened.\n\\Roman: When the lights went out and with the explosion,\nHe told me he is going to find someone and\nIf he doesn't come back I would just head to the rest area.\nI don't know if you've been there yet but, there is a keycard there.\nIt unlocks the armory.\n\n\\Telvy Phil: The Armory?\n\\Roman: Yes. I was gonna head there to grab the RPG and defend myself.\nWas gonna go with Cameron but, you are here at the moment.\nGo and grab the keycard. Head to the armory. There is an RPG there.\n(Press [ and ] to swtich between RPG and rifle)\nAnd if you see Pouya around,\nAsk him. He's gonna tell you what to do.\nHe was with General before the explosion.\nMy version of story is not different than Cameron's.\n\\Telvy Phil: I'll be on my way then. You take care of yourself.\n\\Roman: Thanks. I'll try to stabalize the power.\nThe lights are going on and off. I'll try my best.\nSee you.\n\\";

let roman_cutscene;

function initializeRomanCutscene() {
    roman_cutscene = new Cutscene(romanNPC, roman_dialogue_text, PLAYER_NAME, "Roman", player_idle_animaion[0], npc_idle_animaion[0], "");
    romanNPC.cutsceneAttached = roman_cutscene;
}
