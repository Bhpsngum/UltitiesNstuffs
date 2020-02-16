String.prototype.getProperJSVariableName=function(mode)
{
  let inp=((this||"")=="")?"_":(this.replace(/^(\d)/g,"_$1").replace(/(=|\n|\r|\s|;)/g,"_"));
  let s;
  switch (mode||"")
  {
    case "":
      s="";
      break;
    case "strict":
      s="'use strict';";
      break;
    default:
      throw {name: "ModeError", message: "Unexpected token '"+mode+"'"};
  }
  try
  {
    eval(s+"var "+inp);
  }
  catch(e)
  {
    let err=0;
    try
    {
      eval(s+"var _"+inp);
    }
    catch(er)
    {
      err=1;
      for (let i=0;i<inp.length;i++)
      {
        try
        {
          eval("var "+inp.substring(0,i+1));
        }
        catch(errr)
        {
          inp=inp.substring(0,i)+"_"+inp.substring(i+1,inp.length);
        }
      }
    }
    if (err==0) inp="_"+inp;
  }
  return inp;
};
