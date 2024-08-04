class Cutscene {
  constructor(owner, dialogueText, char1Name=PLAYER_NAME, char2Name=owner.name, char1Img, char2Img, itemToDropAfterCutscene="", itemAnimation=[]) {
    this.owner = owner;
    this.char1Name = char1Name;
    this.char2Name = char2Name;
    this.dialogueText = dialogueText;
    this.itemToDropAfterCutscene = itemToDropAfterCutscene;
    this.itemAnimation = itemAnimation;
    this.dropped_item = false;
    this.char1Img = char1Img;
    this.char2Img = char2Img;
    this.resetCutscene();
  }
  
  update() {
    if (this.isFinished) return;
    if (!this.hasCutsceneStarted()) {
      this.cutsceneStartDelay--;
      return;
    }
    this.handleTextTimer();
  }

  finishCutscene() {
    if (this.CanDropItem()) {
      this.DropItemAttached();
    }
    this.isFinished = true;
  }
  
  goToNextLine() {
    if (this.isFinished) {
      endCurrentCutScene();
      return;
    }
    if (!this.hasCharacterFinishedCurrentLine()) {
      this.currentLineTypingIndex = this.currentLineFinishIndex;
      return;
    }
    this.currentLineTypingIndex = 0;
    this.currentTextTimer = TEXT_TYPING_NEXT_EVERY_SECONDS;
    const indexOfStartOfNextLine = this.dialogueText.indexOf("\\", this.currentLineFinishIndex-1);
  	const indexOfFinishOfNextLine = this.dialogueText.indexOf("\\", indexOfStartOfNextLine+1);
    if (indexOfFinishOfNextLine >= this.dialogueText.length-1) {
      this.finishCutscene();
      return;
    }
    this.currentLineText = this.dialogueText.substring(indexOfStartOfNextLine+1, indexOfFinishOfNextLine);
  	this.currentLineFinishIndex = indexOfFinishOfNextLine;
    this.currentChar = this.currentLineText[0];
    
    /*TESTED WITH const dialogueText = "\\Character1: Hello There!\n What's up?!\n\\Character2: Hola! What up?\n\\Character 1: Nothing man. Same old.\n\\Character 2: Ok dawg.\n\\"*/
  }
  
  hasCutsceneStarted() {
    return this.cutsceneStartDelay <= 0;
  }
  
  hasFullyFinishedCutscene() {
    return this.currentChar == "$" || this.isFinished;
  }
  
  hasCharacterFinishedCurrentLine() {
    return this.currentLineTypingIndex >= this.currentLineText.length-1;
  }
  
  handleTextTimer() {
    if (this.hasFullyFinishedCutscene() || this.hasCharacterFinishedCurrentLine()) return;
    if (this.currentTextTimer <= 0) {
      this.currentTextTimer = TEXT_TYPING_NEXT_EVERY_SECONDS;
      this.currentLineTypingIndex++;
      talk_sound.stop();
      talk_sound.play();
      return;
    }
    this.currentTextTimer--;
  }
  
  drawCutscene() {
    push();
    fill(0);
    rect(0, 0, width, height);
    pop();
    if (this.isCharacter1Line()) {
      this.drawCharacter1();
    }
    else {
      this.drawCharacter2();
    }
    this.drawTextDialogue();
  }
  
  drawCharacter1() {
    push();
    translate(300, (height*0.6));
    scale(5, 5);
    image(this.char1Img, -this.char1Img.width/2, -this.char1Img.height/2);
    pop();
  }
  
  drawCharacter2() {
    push();
    translate(width-300, height*0.6);
    scale(-1, 1);
    if (this.char2Name === "General Fang") scale(1.5, 1.5);
    scale(5, 5);
    image(this.char2Img, -this.char2Img.width/2, -this.char2Img.height/2);
    pop();
  }

  drawTextDialogue() {
    push();
    translate(width/2, height/2+200);
    fill(230, 203, 131);
    rect(-500, -250, 1000, 500);
    translate(-500, -250);
    textFont(character_speech_font);
    const t = this.getLineTextFinal();
    fill(255, 0, 0);
    textSize(30);
    text(t, 50, 50);
    pop();
  }
  
  isCharacter1Line() {
    return this.currentLineText.startsWith(this.char1Name);
  }
  
  getLineTextFinal() {
    return this.currentLineText.substring(this.isCharacter1Line() ? this.char1Name.length+1 : this.char2Name.length+1, this.currentLineTypingIndex);
  }

  CanDropItem() {
    return this.itemToDropAfterCutscene != "" && !this.dropped_item;
  }

  DropItemAttached() {
    if (this.itemToDropAfterCutscene === "Flashlight") {
      currentLevel.items.push(new ConsumableFlashlight(this.owner.pos.copy(), this.itemAnimation));
    }
    else if (this.itemToDropAfterCutscene === "ITEM_NAME") {

    }
    else {
      currentLevel.items.push(new PickableItemOnce(this.owner.pos.copy(), this.itemToDropAfterCutscene, this.itemAnimation));
    }
    
    this.dropped_item = true;
    this.owner.has_dropped_item = true;
  }
  
  resetCutscene() {
    this.currentTextTimer = TEXT_TYPING_NEXT_EVERY_SECONDS;
    this.cutsceneStartDelay = CUTSCENE_START_DELAY_IN_SECONDS;
    this.currentLineTypingIndex = 0;
    this.currentLineText = "";
    this.currentChar = "";
    this.isFinished = false;
    this.currentLineFinishIndex = 0;
  }
  
}
