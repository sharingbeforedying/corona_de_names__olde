class Utils {

  static range(size, startAt = 0) {
      return [...Array(size).keys()].map(i => i + startAt);
  }

  static extendObj(obj1, obj2){
      for (var key in obj2){
          if(obj2.hasOwnProperty(key)){
              obj1[key] = obj2[key];
          }
      }

      return obj1;
  }

  static logSchema(schema) {
    for(key in schema) {
      console.log(schema[key]);
    }
  }

}

exports.Utils = Utils;
