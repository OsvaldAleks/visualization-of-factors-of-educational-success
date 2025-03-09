function Integrator(values){
  this.damping = 0.5
  this.attraction = 0.05
  
  this.values = structuredClone(values)
  this.vels = new Array(values.length).fill(0)
  this.accels = new Array(values.length).fill(0)
  this.forces = new Array(values.length).fill(0)
  this.mass = 1
  
  this.targeting = false
  this.targets = values
  
  this.set = function(f){
    this.values = f
  }
  this.update = function(){
    let updated = false;
    if(this.targeting){
      let allEqual = true;
      const epsilon = 0.0001;
      for (let i = 0; i < this.targets.length; i++) {
        this.forces[i] = 0;
        if (this.targeting) {
          this.forces[i] = this.attraction * (this.targets[i] - this.values[i]);
          updated = true;
        }
        this.accels[i] = this.forces[i] / this.mass;
        this.vels[i] = (this.vels[i] + this.accels[i]) * this.damping;
        this.values[i] += this.vels[i];
  
        if (Math.abs(this.targets[i] - this.values[i]) > epsilon) {
          allEqual = false;
        }
      }
      if (allEqual) {
        this.targeting = false;
      }
    }
    return updated;
  }

  this.target = function(f){
    this.targeting = true
    //for (let i = 0; i < this.values.length; i++) {
    //  if (Number.isNaN(this.values[i])){
    //    this.values[i] = 0
    //    console.log("NaN found")
    //  }
    //}
    this.targets = f
  }
  this.noTarget = function(){
    this.targeting = false
  }
}
