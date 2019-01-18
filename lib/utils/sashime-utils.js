module.exports = {
  typecheck: (v,conf) => {
    let pass = false;

    if(conf.type !== undefined){
      pass = typeof v === conf.type;
    }
    if(conf.value !== undefined){
      pass = typeof v === conf.value;
    }
    if(conf.enum !== undefined){
      pass = conf.enum.some(value => v === value);
    }

    return pass;
  },
}
