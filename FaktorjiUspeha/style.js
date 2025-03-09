function Style(){
    //TEXT VARIABLES
    this.titleSize = 30;
    this.annotationSize = 15;
    this.blockTitleSize = 18;
    this.hoverSize = 30;
    this.hoverSize2 = 17;
    this.numOfDataSize = 20;
    this.buttonSize = 17;

    this.textColor = '#bac2de'
    this.textHaflTransparent = color(186, 194, 222, 64)
    this.white = '#ffffff'
    this.backgroundColor = '#222232'
    this.dataColor = '#9399b2'
    this.blockColor = '#313244'
    this.blockColorLight = '#45475a'
    this.annotationLines = '#585b70'
    this.green = '#a4f28a'
    this.red = '#f38ba8'
    this.hoverColor = color(198, 208, 245, 70)
    this.unselectedColor = color(147, 153, 178, 170)
    this.selectionBarColor = '#f5e0dc'

//STYLE 1 
/*
    this.white = '#a4f28a'
    this.dataColor = '#f9e2af'
    this.green = '#a4f28a'
    this.red = '#a4f28a'
*/
  
  this.upadteTitleSize = function(text){
    this.titleSize = 30
    textSize(this.titleSize)
    let textW = textWidth(text)
    while(windowWidth-150 < textW){
      this.titleSize -= 1;
      if(this.titleSize <=1){
        this.titleSize = 1;
        break;
      }
      if (windowWidth-100 <= 0){
        this.titleSize = 1;
        break;
      }
      textSize(this.titleSize)
      textW = textWidth(text)
    }
  }
  
  this.getTitle = function(){
    return {'fontSize': this.titleSize, 'color': this.textColor, 'align':LEFT, 'alignY': BOTTOM, 'yOffset': 0}
  }
  this.getButton = function(){
    return {'fontSize': this.buttonSize, 'color': this.textColor, 'align':CENTER, 'alignY': CENTER, 'yOffset': 0}
  }
  this.getNumberOfDatapoints = function(){
    return {'fontSize': this.numOfDataSize, 'color': this.textColor, 'align':RIGHT, 'alignY': BOTTOM, 'yOffset': 0}
  }
  this.getAnnotation = function(weight = NORMAL, textColor = 'no', align = CENTER){
    return {'fontSize': this.annotationSize, 'color': textColor!='transparent'?this.textColor:this.textHaflTransparent, 'yOffset': 5, 'weight': weight, 'align': align}
  }
  this.getScaleAnnotation = function(weight = NORMAL){
    return {'fontSize': this.annotationSize, 'color': this.textColor, 'yOffset': 0, 'align':RIGHT, 'alignY': CENTER, 'weight': weight}
  }
  this.getBlockTitle = function(yOff = -1*this.blockTitleSize){
    return {'fontSize': this.blockTitleSize, 'color': this.textColor, 'align':LEFT, 'yOffset': yOff}
  }
  this.getDataHoverPos = function(){
    return {'fontSize': this.hoverSize, 'color': this.white, 'border': 5, 'borderColor':this.backgroundColor, 'align':CENTER, 'alignY': CENTER, 'yOffset': 0}
  }
  this.getDataHoverNeg = function(){
    return {'fontSize': this.hoverSize, 'color': this.textColor, 'border': 5, 'borderColor':this.backgroundColor, 'align':RIGHT, 'yOffset': -0.8*this.hoverSize2-this.hoverSize}
  }
  this.getDataHover2 = function(){
    return {'fontSize': this.hoverSize2, 'color': this.textColor, 'border': 5, 'borderColor':this.backgroundColor, 'align':CENTER, 'yOffset': -2*this.hoverSize2}
  }
  this.getBlockStyle = function(){
    return {'backgroundColor': this.blockColor = '#313244','color': this.textColor, 'scaleAnnotation': this.getScaleAnnotation(), 'text': this.getBlockTitle(), 'xLabel': this.getAnnotation()}
  }
  this.getLightBlockStyle = function(){
    return {'backgroundColor': this.blockColor = '#45475a','color': this.textColor, 'scaleAnnotation': this.getScaleAnnotation(), 'text': this.getBlockTitle(), 'xLabel': this.getAnnotation()}
  }
}
