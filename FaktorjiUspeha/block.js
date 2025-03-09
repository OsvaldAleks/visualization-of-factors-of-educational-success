function Block(startX, startY, endX, endY, title, style, xLabel = null, yLabel = null){
  this.startX = 0
  this.startY = 0
  this.endX = 0
  this.endY = 0
  this.title = title
  this.style = style
  this.xLabel = xLabel
  this.yLabel = yLabel
  
  this.setScale = function(startX, startY, endX, endY){
    this.startX = startX
    this.startY = startY
    this.endX = endX
    this.endY = endY
  }
  
  this.drawBlock = function(){
      //write title
      writeText(this.title, this.style.text, this.startX, this.startY);
      
      if(this.xLabel != null){
        writeText(this.xLabel, this.style.xLabel, (this.startX+this.endX)/2, this.endY+this.style.xLabel.fontSize);
      }
      
      if(this.yLabel != null){
        let xOff = textWidth("00%")
        writeText(this.yLabel, this.style.xLabel, this.startX-2*xOff, (this.startY+this.endY)/2, angle = -PI/2);
      }
      //background
      strokeWeight(0);
      fill(this.style.backgroundColor);
      rect(this.startX, this.startY, this.endX-this.startX, this.endY-this.startY);
  }
  
  this.drawYScale = function(maxVal, step){
    for(let i = 0; i < maxVal; i+=step){
      let y = map(i, 0, maxVal, this.endY, this.startY)
      stroke(this.style.color)
      strokeWeight(2)
      line(this.startX-5, y, this.startX-5, y);
      writeText(Math.round(i)+'%', this.style.scaleAnnotation, this.startX-10, y)
    }
    this.startX
  }
  
  this.getWidth = function(){
    return this.endX-this.startX;
  }
}
