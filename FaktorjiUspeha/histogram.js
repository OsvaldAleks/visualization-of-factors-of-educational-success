function Hist(values, labels, title, style, xLabel = null, yLabel = null){
  this.values = values
  this.valuesReff = values
  this.labels = labels
  this.style = style
  this.block = new Block(0,0,0,0,title,this.style.getBlockStyle(), xLabel = xLabel, yLabel = yLabel)
  this.yScale=null
  let timeout;
  this.snapDelay = 300; 
  this.snappingElement = null;
  this.isScrolling = false;
  this.rangeStart = 0
  this.rangeEnd = 1
  
  this.setScale = function(startX, startY, endX, endY,labels){
    this.block.setScale(startX, startY, endX, endY);
    this.labels = labels;
    this.rangeStart = snapToNearest(this.rangeStart, arrayRange(0,1,1/this.labels.length))
    this.rangeEnd = snapToNearest(this.rangeEnd, arrayRange(0,1,1/this.labels.length))
    let delta = (this.block.endX-this.block.startX)/this.labels.length
    delta = map(delta, 0, this.block.getWidth(), 0, 1)
    if (this.rangeEnd == 0){
      this.rangeEnd = this.rangeStart + delta}
    else if (this.rangeStart == 1){
      this.rangeStart = this.rangeEnd - delta}
      //this.reffs = reff
    
  }
  
  this.drawHist = function() {
    //get absolutes of hist
    let maxVal = Math.max(Math.max.apply(null, this.values), Math.max.apply(null, this.valuesReff))*1.05;
    let minVal = Math.min(Math.min.apply(null, this.values), Math.min.apply(null, this.valuesReff));
  
    this.block.drawBlock();
    
    let step = 0;
    switch (true) {
      case (maxVal < 0.3): step = 5; break;
      case (maxVal < 0.6): step = 10; break;
      case (maxVal < 1.05): step = 20; break;
      default: step = 100;
    }
    this.block.drawYScale(maxVal*100, step);
    //hist
    this.step = this.labels[1] - this.labels[0]
    for (let i = 0; i < this.labels.length; i++) {
      let posX1 = this.block.startX + i*((this.block.endX-this.block.startX)/this.labels.length);
      let posX2 = this.block.startX + (i+1)*((this.block.endX-this.block.startX)/this.labels.length);
      let posY2 = this.block.endY;
      
      let posY1 = map(this.values[i], 0, maxVal, this.block.endY, this.block.startY);
      let posY1Reff = map(this.valuesReff[i], 0, maxVal, this.block.endY, this.block.startY);

      strokeWeight(0)
      if(this.values[i] > this.valuesReff[i]){
        let cFrom = hue(this.style.red)
        let cTo =hue(color(this.style.green))
        let hueDiff = (cTo - cFrom + 360) % 360;  
        if (hueDiff > 180) {
          hueDiff -= 360;
        }
        let c = cFrom + map(i, 0, this.labels.length - 1, 0, hueDiff);
        c = (c + 360) % 360;
        colorMode(HSL)
        fill(color(c%360, saturation(this.style.green), lightness(this.style.green)));
        rect(posX1, posY1, posX2-posX1, posY2-posY1);
        fill(this.style.dataColor);
        rect(posX1, posY1Reff, posX2-posX1, posY2-posY1Reff);
      }
      else{
        fill(this.style.backgroundColor);
        rect(posX1, posY1Reff, posX2-posX1, posY2-posY1Reff);
        fill(this.style.dataColor);
        rect(posX1, posY1, posX2-posX1, posY2-posY1);
      }
      
      stroke(this.style.blockColorLight);
      strokeWeight(3);
      line(posX1, this.block.startY, posX1, this.block.endY);
      
      let textPos = (posX1+posX2)/2
      if(this.rangeStart == 0 && this.rangeEnd == 1){
        writeText(this.labels[i], this.style.getAnnotation(), textPos, this.block.endY); //TODO: bold selected number
      }
      else{
        if(this.block.startX+this.block.getWidth()*this.rangeStart <= textPos && this.block.startX+this.block.getWidth()*this.rangeEnd >= textPos){
            writeText(this.labels[i], this.style.getAnnotation(weight = BOLD), textPos, this.block.endY); //TODO: bold selected number
        }
        else{
            writeText(this.labels[i], this.style.getAnnotation(weight = NORMAL, textColor='transparent'), textPos, this.block.endY); //TODO: bold selected number
        }
      }
    }
    stroke(this.style.blockColorLight);
    strokeWeight(3);
    line(this.block.endX, this.block.startY, this.block.endX, this.block.endY);
    this.checkHover();
    this.drawRange();
    for (let i = 0; i < this.labels.length; i++) {
      posX1 = this.block.startX + i*((this.block.endX-this.block.startX)/this.labels.length);
      posX2 = this.block.startX + (i+1)*((this.block.endX-this.block.startX)/this.labels.length);
      this.checkHoverElement(posX1, this.block.startY, posX2, this.block.endY, this.values[i], this.valuesReff[i])
    }
  }
  
  this.drawRange = function(start, end){
    fill(this.style.unselectedColor);
    strokeWeight(0);
    rect(this.block.startX, this.block.startY, this.block.getWidth()*this.rangeStart, this.block.endY-this.block.startY);
    rect(this.block.startX+this.block.getWidth()*this.rangeEnd, this.block.startY, this.block.endX-(this.block.startX+this.block.getWidth()*this.rangeEnd), this.block.endY-this.block.startY);
  }
  
  this.checkHover = function(){
    if (this.block.startX-1<mouseX && mouseX<this.block.endX+1 && this.block.startY<mouseY && mouseY<this.block.endY){
      this.mouseIn = true
      cursor(HAND);
      strokeWeight(3);
      stroke(this.style.selectionBarColor);
      let mouseInRange = map(mouseX-this.block.startX, 0, this.block.getWidth(), 0, 1)
      let dStart = mouseInRange-this.rangeStart;
      let dEnd = this.rangeEnd-mouseInRange;
      if (!this.isScrolling) {
        this.snappingElement = (dStart < dEnd)?1:0;
      }
      if(this.snappingElement){
        let x = this.block.startX+this.rangeStart*this.block.getWidth()
        line(x, this.block.startY, x, this.block.endY)
      }
      else{
        let x = this.block.startX+this.rangeEnd*this.block.getWidth()
        line(x, this.block.startY, x, this.block.endY)
      }
    }
    else
      this.mouseOut()
  }
  
  this.mouseOut = function(){
    if(this.mouseIn){
      this.mouseIn = false
      cursor(ARROW);
    }
  }
  
  this.checkOnClick = function(){
    if (this.block.startX-1<mouseX && mouseX<this.block.endX+1 && this.block.startY<mouseY && mouseY<this.block.endY){
      let mouseInRange = map(mouseX-this.block.startX, 0, this.block.getWidth(), 0, 1)
      mouseInRange = snapToNearest(mouseInRange, arrayRange(0,1,1/this.labels.length))
      if(this.snappingElement){
        this.rangeStart = mouseInRange
        if(this.rangeStart > this.rangeEnd){
          this.rangeEnd = this.rangeStart + Math.pow(10,(-5))
        }
      }
      else{
        this.rangeEnd = mouseInRange
        if(this.rangeStart > this.rangeEnd){
          this.rangeStart = this.rangeEnd - Math.pow(10,(-5))
        }
      }
    }
  }
  
  this.checkHoverElement = function(X1, Y1, X2, Y2, data, reff){
    if (X1<mouseX && mouseX<X2 && Y1<mouseY && mouseY<Y2 && !mouseIsDown) {
      let mouseInRange = map(mouseX-this.block.startX, 0, this.block.getWidth(), 0, 1)
      
      if(mouseInRange < this.rangeEnd && mouseInRange > this.rangeStart){
        fill(this.style.hoverColor);
        strokeWeight(0);
        rect(X1, Y1, X2-X1, Y2-Y1);

        let dataString = Math.round(100*data)+"%"
        let reffString = "Referenca: "+Math.round(100*reff)+"%"
        writeText(dataString, this.style.getDataHoverPos(), (X1+X2)/2, (Y1+Y2)/2);
        writeText(reffString, this.style.getDataHover2(), (X1+X2)/2, Y2);

      }
    }
  }
  
  this.updateValues = function(values) {
    this.values = values;
  }
  
  this.checkOnScroll = function(deltaY){
    if (this.block.startX-1<mouseX && mouseX<this.block.endX+1 && this.block.startY<mouseY && mouseY<this.block.endY){
        let mouseInRange = map(mouseX-this.block.startX, 0, this.block.getWidth(), 0, 1)
        let dStart = mouseInRange-this.rangeStart;
        let dEnd = this.rangeEnd-mouseInRange;
        
        if (!this.isScrolling) {
          this.snappingElement = (dStart < dEnd)?1:0;
          this.isScrolling = true;
        }
        
        delta = (this.block.endX-this.block.startX)/this.labels.length
        delta = map(delta, 0, this.block.getWidth(), 0, 1)*(deltaY/Math.abs(deltaY))
        clearTimeout(timeout);

        timeout = setTimeout(() => {
          this.isScrolling = false;
        }, this.snapDelay);
        
        if(this.isScrolling && this.snappingElement == 1){
          if(this.rangeStart-delta < (this.rangeEnd-0.01) && this.rangeStart-delta >= 0)
            this.rangeStart -= delta;
          else if(this.rangeStart-delta < 0)
            this.rangeStart = 0;
          else if(this.rangeStart-delta >= (this.rangeEnd-0.01)){
            if(this.rangeEnd-delta <= 1){
              this.rangeEnd = this.rangeEnd-delta
              this.rangeStart = this.rangeEnd+delta}
            else{
              this.rangeEnd = 1
              this.rangeStart = this.rangeEnd+delta}
            //this.rangeStart = this.rangeEnd - Math.pow(10,(-5))
          }
          this.scrollingFirst = true
        }
        else{
          if(this.rangeEnd-delta > (this.rangeStart+0.01) && this.rangeEnd-delta <= 1)
            this.rangeEnd -= delta
          else if(this.rangeEnd-delta > 1)
            this.rangeEnd = 1;
          else if(this.rangeEnd-delta <= (this.rangeStart+0.01)){
            if(this.rangeStart-delta >= 0){
              this.rangeStart = this.rangeStart-delta
              this.rangeEnd = this.rangeStart+delta}
            else{
              this.rangeStart = 0
              this.rangeEnd = this.rangeStart+delta}
          }
          this.scrollingFirst = false
        }
        this.midScroll = true //
    }
  }

  
}
