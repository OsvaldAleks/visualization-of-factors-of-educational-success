function Bubbles(values, labels, title, style, valueMap, labelMap){
  
  this.values = values
  this.valuesReff = values
  this.labels = labels
  this.title = title
  this.style = style
  this.valueMap = valueMap
  this.labelMap = labelMap
  this.selectedElement = null
  this.mouseIn = false;
      
  this.block = new Block(0,0,0,0,title,this.style.getBlockStyle())
  
  this.setScale = function(startX, startY, endX, endY){
    this.block.setScale(startX, startY, endX, endY);
    this.sizeFactor = Math.min((this.block.endX - this.block.startX)/this.values.length, this.block.endY - this.block.startY)*0.9;
  }
  
  this.drawBubbles = function() {
    //get absolutes
    maxVal = Math.max(Math.max.apply(null, this.values), Math.max.apply(null, this.valuesReff))*1.05;
    minVal = Math.min(Math.min.apply(null, this.values), Math.min.apply(null, this.valuesReff));
  
    this.block.drawBlock();
    
    let hoverCheck = false
    //bubbles
    for (let i = 0; i < this.values.length; i++) {
      posX = this.block.startX + ((i*((this.block.endX-this.block.startX)/this.values.length))+((i+1)*((this.block.endX-this.block.startX)/this.values.length)))/2;
      posY = (this.block.startY+this.block.endY)/2;
      
      radiusReff = map(this.valuesReff[i], 0, maxVal, 0, this.sizeFactor);
      radius = map(this.values[i], 0, maxVal, 0, this.sizeFactor);
      
      if(radius > radiusReff){let cFrom = hue(this.style.red)
        let cTo =hue(color(this.style.green))
        let hueDiff = (cTo - cFrom + 360) % 360;  
        if (hueDiff > 180) {
          hueDiff -= 360;
        }
        let c = cFrom + map(i, 0, this.labels.length - 1, 0, hueDiff);
        c = (c + 360) % 360;
        colorMode(HSL)
        fill(color(c%360, saturation(this.style.green), lightness(this.style.green)));
        circle(posX, posY, radius);
        fill(this.style.dataColor);
        circle(posX, posY, radiusReff);
      }
      else{
        fill(this.style.backgroundColor)
        circle(posX, posY, radiusReff);
        fill(this.style.dataColor);
        circle(posX, posY, radius);
      }
      if(this.selectedElement != null && this.selectedElement != i){
        fill(this.style.unselectedColor);
        circle(posX, posY, radiusReff);
          writeText(this.labelMap[i], this.style.getAnnotation(weight = NORMAL, textColor='transparent'), posX, this.block.endY); //TODO: bold selected number
      }
      else if(this.selectedElement != null && this.selectedElement == i){
        writeText(this.labelMap[i], this.style.getAnnotation(weight = BOLD), posX, this.block.endY); //TODO: bold selected number
      }
      else{
        writeText(this.labelMap[i], this.style.getAnnotation(), posX, this.block.endY);//TODO: bold if selected
      }
      if(this.checkHover(posX, posY, Math.max(radius, radiusReff), this.values[i], this.valuesReff[i], i)){
        hoverCheck = true;}
    }
    if(hoverCheck){
      cursor(HAND);
    }
    else{
      this.mouseOut()
    }
  }
  
  this.checkHover = function(X1, Y1, radius, data, reff, i){
    let radius2 = (radius < this.sizeFactor*0.30) ?this.sizeFactor*0.30 :radius;
    if (dist(mouseX, mouseY, X1, Y1) < radius2/2) {
      hoverCheck = true
      this.mouseIn=true
      strokeWeight(0);
      fill(this.style.hoverColor);
      circle(X1, Y1, radius);
      
      /*
      textSize(this.style.getDataHoverPos().fontSize)
      let dataString = Math.round(100*data)+"%"
      let textW = textWidth(dataString)
      textSize(this.style.getDataHover2().fontSize)
      let reffString = "Referenca:"+Math.round(100*reff)+"%"
      let textW2 = textWidth(reffString)
      if (textW<textW2)
        textW = textW2
      
      let posX = mouseX
      if(mouseX<textW)
        posX = textW
        
      if(data>=reff)
        writeText(dataString, this.style.getDataHoverPos(), posX, mouseY);
      else
        writeText(dataString, this.style.getDataHoverNeg(), posX, mouseY);
      writeText(reffString, this.style.getDataHover2(), posX, mouseY);
      */
      let dataString = Math.round(100*data)+"%"
      writeText(dataString, this.style.getDataHoverPos(), X1, Y1);
      
      let reffString = "Referenca: "+Math.round(100*reff)+"%"
      writeText(reffString, this.style.getDataHover2(), X1, this.block.endY);
      strokeWeight(0);
      return true
    }
    return false
  }
  this.mouseOut = function(){
    if(this.mouseIn){
      this.mouseIn = false
      cursor(ARROW);
    }
  }
  
  this.checkOnClick = function(){
    //get absolutes
    maxVal = Math.max(Math.max.apply(null, this.values), Math.max.apply(null, this.valuesReff))*1.05;
    minVal = Math.min(Math.min.apply(null, this.values), Math.min.apply(null, this.valuesReff));
      
    //bubbles
    for (let i = 0; i < this.values.length; i++) {
      posX = this.block.startX + ((i*((this.block.endX-this.block.startX)/this.values.length))+((i+1)*((this.block.endX-this.block.startX)/this.values.length)))/2;
      posY = (this.block.startY+this.block.endY)/2;
      
      radiusReff = map(this.valuesReff[i], 0, maxVal, 0, this.sizeFactor);
      radius = map(this.values[i], 0, maxVal, 0, this.sizeFactor);
      
      radius = Math.max(radius, radiusReff);
      let radius2 = (radius < this.sizeFactor*0.30) ?this.sizeFactor*0.30 :radius;
      if (dist(mouseX, mouseY, posX, posY) < radius2/2) {
        if(this.selectedElement==i){
          this.selectedElement = null
        }
        else {
          this.selectedElement = i
        }
      }
    }
  }
  
  this.updateValues = function(values) {
    this.values = values;
  }
}
