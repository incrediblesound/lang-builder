class Store {
  constructor(){
    this.languages = []
    this.currentLanguage = null;
  }
  set(key, val){
    this[key] = val;
  }
  get(key){
    return this[key]
  }
}