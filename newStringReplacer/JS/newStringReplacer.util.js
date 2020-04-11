String.prototype.oldReplace=String.prototype.replace;
String.prototype.replace= function()
{
    function getIndex(array,n)
    {
        let index=0;
        for (let i=0;i<n;i++) index+=array[i].length;
        return index;
    }
    function toString(param)
    {
        switch(param)
        {
            case void 0:
                return "undefined";
            case null:
                return "null";
            default:
                return param.toString();
        }
    }
    function caseinsensitivecompare(st1,st2,n)
    {
        return (n)?(st1.toUpperCase()==st2.toUpperCase()):(st1==st2);
    }
    function replace(st,finder,replaceparam,isGlobal,isCaseinSensitive,addIndex,startIndex)
    {
        let d=0,s=st;
                for (let i=startIndex;i<=st.length-finder.length;i++)
                {
                    let result=st.slice(i,i+finder.length);
                    if (caseinsensitivecompare(result,finder,isCaseinSensitive))
                    {
                        let parsed=(typeof replaceparam === "function")?toString(replaceparam(result,i+addIndex)):toString(replaceparam);
                        s=s.slice(0,i+d)+parsed+s.slice(i+d+finder.length,s.length);
                        d+=parsed.length-finder.length;
                    }
                    if (!isGlobal) break;
                }
                return s;
    }
    let args=arguments,u;
    try
    {
        u=toString(new RegExp(args[0]));
    }
    catch(e)
    {
        u="";
    }
    if (args.length<3 || (u==toString(args[0]))) return this.oldReplace(args[0],args[1]);
    else
    {
        let finder=toString(args[0]),flags={},replaceparam=args[2],str=this,existflags="igmsbe",m=[str];
        for (let flag of existflags) flags[flag]=toString(args[1]).includes(flag);
        let special=flags.b || flags.e;
        if (flags.m && flags.g)
        {
            let preIndex=-1;
            m=[];
            for (let i=0;i<=str.length;i++)
            {
                if (str[i]=="\n" || str[i]=="\r" || i==str.length)
                {
                    m.push(str.slice(preIndex+1,i));
                    m.push(str[i]||"");
                    preIndex=i;
                }
            }
        }
        let mm=[...m];
        for (let i=0;i<m.length;i+=2)
        {
            let st=m[i];
            if (flags.b || flags.e)
            {
                let be=0,start=0;
                if (flags.b && flags.e)
                {
                    if (caseinsensitivecompare(st,finder,flags.i)) be=1;
                }
                else
                {
                    let result;
                    if (flags.b) result=st.slice(0,finder.length);
                    else
                    {
                        result=st.slice(-finder.length);
                        start=st.length-finder.length;
                        if (start<0) start=0;
                    }
                    be= caseinsensitivecompare(result,finder,flags.i);
                }
                if (be) mm[i]=replace(st,finder,replaceparam,0,flags.i,getIndex(m,i),start);
            }
            if (!special) mm[i]=replace(st,finder,replaceparam,flags.g,flags.i,getIndex(m,i),0);
            if (!flags.g) break;
        }
        return mm.join();
    }
}
