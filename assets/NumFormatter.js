// (C) http://walter.bislins.ch/doku/NumFormatter

function CNumFormatter(){this.Lang='iso';this.DecimalChar=',';this.MantGrpChar=' ';this.MantGrpSize=3;this.MantGrpMinSize=4;this.FracGrpChar=' ';this.FracGrpSize=3;this.FracGrpMinSize=4;this.TableLike=true;this.ExpChar=' E';this.ExpLeadZero=2;this.ShowExpPlus=true;this.HideZeroExp=false;this.UnitSepChar=' ';this.Mode='std';this.AltMode='eng';this.AltPrec=13;this.Precision=8;this.Prefix=['a','f','p','n','µ','m','','k','M','G','T','P','E'];this.Prefix0=6;this.MaxPrec=13;this.MaxDigits=17;try{this.SetFormat(NUMBER_FORMATING);}catch(e){}}
CNumFormatter.prototype.SetLang=function(aLang){this.SetFormat(aLang);}
CNumFormatter.prototype.SetFormat=function(aLang){aLang=aLang.toLowerCase();if(aLang=='calc'){this.DecimalChar='.';this.MantGrpChar='';this.MantGrpSize=3;this.MantGrpMinSize=4;this.FracGrpChar='';this.FracGrpSize=3;this.FracGrpMinSize=4;}else if(aLang=='en'){this.DecimalChar='.';this.MantGrpChar=',';this.MantGrpSize=3;this.MantGrpMinSize=4;this.FracGrpChar='';this.FracGrpSize=3;this.FracGrpMinSize=4;}else if(aLang=='de'){this.DecimalChar=',';this.MantGrpChar='.';this.MantGrpSize=3;this.MantGrpMinSize=4;this.FracGrpChar='';this.FracGrpSize=3;this.FracGrpMinSize=4;}else if(aLang=='ch'){this.DecimalChar=',';this.MantGrpChar='\'';this.MantGrpSize=3;this.MantGrpMinSize=4;this.FracGrpChar='';this.FracGrpSize=3;this.FracGrpMinSize=4;}else{this.DecimalChar=',';this.MantGrpChar=' ';this.MantGrpSize=3;this.MantGrpMinSize=4;this.FracGrpChar=' ';this.FracGrpSize=3;this.FracGrpMinSize=4;}
this.Lang=aLang;}
CNumFormatter.prototype.SetPrefix=function(aPrefixList,aPrefix0){this.Prefix=aPrefixList;this.Prefix0=aPrefix0;}
CNumFormatter.prototype.GetPrefixFromNumParts=function(aNumParts){var ix=aNumParts.PrefixIx;if(ix>=0&&ix<this.Prefix.length){return this.Prefix[ix];}else{return'';}}
CNumFormatter.prototype.IsArray=function(aObj){return(Object.prototype.toString.call(aObj)==='[object Array]');}
CNumFormatter.prototype.IsNumeric=function(x){return(!this.IsArray(x)&&(x-parseFloat(x)>=0));}
CNumFormatter.prototype.IsXmsFormat=function(aFormat){return(aFormat=='hms'||aFormat.indexOf('dm')>=0);}
CNumFormatter.prototype.Format=function(aNum,aFormat,aDigits,aUnits,aLang){var numStr;var oldLang=this.Lang;if(aLang&&aLang!==''){this.SetLang(aLang);}
if(this.IsXmsFormat(aFormat)){numStr=this.FormatXms(aNum,aFormat,aDigits);}else if(aFormat!=''){var formatData={Mode:aFormat,Precision:aDigits};var numParts=this.SplitNum(aNum,formatData);numStr=this.NumPartsToString(numParts);if((aUnits&&aUnits!='')||aFormat==='unit'){if(!aUnits)aUnits='';var prefix=this.GetPrefixFromNumParts(numParts);var space='';if(aUnits.indexOf(' ')==0){aUnits=aUnits.substr(1);space=' ';}
numStr+=space+prefix+aUnits;}}else{numStr=aNum.toString();if(aUnits&&aUnits!='')numStr+=aUnits;}
if(aLang&&aLang!==''){this.SetLang(oldLang);}
return numStr;}
CNumFormatter.prototype.FormatNumStr=function(aNumStr){var x=aNumStr.split('.');if(!this.IsNumeric(x[0])||(x.length>1&&!this.IsNumeric(x[1])))return aNumStr;var x1=x[0];var x2=x.length>1?x[1]:'';if(this.MantGrpChar!=''&&this.MantGrpSize>0&&x1!=''&&(this.TableLike||x1.length>this.MantGrpMinSize)){var rgx=new RegExp('(\\d+)(\\d{'+this.MantGrpSize+'})','');while(rgx.test(x1)){x1=x1.replace(rgx,'$1'+this.MantGrpChar+'$2');}}
if(this.FracGrpChar!=''&&this.FracGrpSize>0&&x2!=''&&(this.TableLike||x2.length>this.FracGrpMinSize)){var rgx=new RegExp('(\\d{'+this.FracGrpSize+'})(\\d+)','');while(rgx.test(x2)){x2=x2.replace(rgx,'$1'+this.FracGrpChar+'$2');}}
if(x2!='')x1+=this.DecimalChar+x2;return x1;}
CNumFormatter.prototype.CutTrailingZeros=function(aNumStr){var p=aNumStr.indexOf('.');if(p<0)return aNumStr;var s=aNumStr.replace(/0+$/,'');if(p==(s.length-1)){s=s.substr(0,p);}
return s;}
CNumFormatter.prototype.SplitNumStr=function(aNumStr){var exp=0;var expStr='';var mantStr=aNumStr;var p=mantStr.indexOf('e');if(p<0)p=mantStr.indexOf('E');if(p>0){expStr=mantStr.substr(p+1);mantStr=mantStr.substr(0,p);exp=parseInt(expStr,10);}
return{MantStr:mantStr,ExpStr:expStr,Exp:exp};}
CNumFormatter.prototype.GetExponent=function(aNum,aPrec){if(aPrec<1)aPrec=1;var numSciStr=aNum.toExponential(aPrec-1);var numStrParts=this.SplitNumStr(numSciStr);return numStrParts.Exp;}
CNumFormatter.prototype.NDigits=function(aNumStr){var s=aNumStr.replace(/[eE][+-]?\d+/,'');s=s.replace(/\D/g,'');return s.length;}
CNumFormatter.prototype.ExpToStr=function(aExp,aLeadingZeros){var expStr=aExp.toFixed(0);while(expStr.length<aLeadingZeros)expStr='0'+expStr;return expStr;}
CNumFormatter.prototype.SplitNum=function(aNum,aFormat){var mode=this.Mode.toLowerCase();var prec=this.Precision;var units='';if(typeof(aFormat)=='object'){if(typeof(aFormat.Mode)=='string'){mode=aFormat.Mode.toLowerCase();}
if(typeof(aFormat.Units)=='string'){units=aFormat.Units;}
if(typeof(aFormat.Precision)=='number'){prec=aFormat.Precision;}}
if(prec<0){prec=0;}
if(prec>this.MaxPrec){prec=this.MaxPrec;}
var numParts={MantSign:1,Mant:aNum,ExpSign:1,Exp:0,Exp3:0,PrefixIx:-1,InitMode:mode,Mode:mode,Precision:prec,Units:units};var mantSign=1;var mant=aNum;if(mant<0){mant=-mant;mantSign=-1;}
numParts.MantSign=mantSign;numParts.Mant=mant;if(mode=='prec'){var exp=this.GetExponent(mant,prec);if(exp<0){mode='std';numParts.Mode=mode;}}
if(mode=='std'){if(prec<1){prec=1;}
numParts.Precision=prec;var nd=prec;var exp=this.GetExponent(mant,prec);var prec1=prec-1;if(exp>=prec1){nd+=exp-prec1;}else{nd+=-exp;}
if(nd>this.MaxDigits){mode=this.AltMode.toLowerCase();}else{return numParts;}}else if(mode=='fix'||mode=='fix0'){var precStr=mant.toFixed(prec);var forceExp=(precStr.indexOf('e')>0||precStr.indexOf('E')>0);if(mode=='fix')precStr=this.RemoveTrailingZeros(precStr);var nd=this.NDigits(precStr);if(nd>this.MaxDigits||forceExp){mode=this.AltMode.toLowerCase();prec=this.AltPrec;if(prec>this.MaxPrec){prec=this.MaxPrec;}}else{return numParts;}}else if(mode=='weak'||mode=='weak0'){var exp=this.GetExponent(mant,prec);var precStr=mant.toFixed(prec);var forceExp=(precStr.indexOf('e')>0||precStr.indexOf('E')>0);if(mode=='weak')precStr=this.RemoveTrailingZeros(precStr);var nd=this.NDigits(precStr);if(nd>this.MaxDigits||exp<-prec||forceExp){mode=this.AltMode.toLowerCase();prec=this.AltPrec;if(prec>this.MaxPrec){prec=this.MaxPrec;}}else{return numParts;}}else if(mode=='prec'){if(prec<1){prec=1;}
numParts.Precision=prec;var exp=this.GetExponent(mant,prec);var precStr=mant.toPrecision(prec);var forceExp=(precStr.indexOf('e')>0||precStr.indexOf('E')>0);var nd=this.NDigits(precStr);if(nd>this.MaxDigits||exp<=-prec||exp>=prec||forceExp){mode=this.AltMode.toLowerCase();}else{return numParts;}}else if(mode!=='sci'&&mode!=='eng'&&mode!=='unit'){mode='sci';numParts.Mode=mode;}
if(prec<1){prec=1;}
var exp=0;var expSign=1;var exp3=0;if((mode=='eng'||mode=='unit')&&prec<3)prec=3;exp=this.GetExponent(mant,prec);if(exp<0){expSign=-1;exp=-exp;}
mant/=Math.pow(10,expSign*exp);if(mode==='eng'||mode==='unit'){var corr=exp%3;if(expSign<0){corr=(3-corr)%3;}
if(corr>0){exp-=expSign*corr;mant*=Math.pow(10,corr);}
prec-=corr;exp3=expSign*Math.floor(exp/3);if(mode==='unit'){var prefixIx=exp3+this.Prefix0;if(prefixIx>=0&&prefixIx<this.Prefix.length){exp-=expSign*exp3*3;numParts.PrefixIx=prefixIx;}}}
numParts.Mode=mode;numParts.MantSign=mantSign;numParts.Mant=mant;numParts.ExpSign=expSign;numParts.Exp=exp;numParts.Exp3=exp3;numParts.Precision=prec;return numParts;}
CNumFormatter.prototype.RemoveTrailingZeros=function(numStr){numStr=numStr.replace(/(\.\d*?)0+$/,'$1');numStr=numStr.replace(/\.$/,'');return numStr;}
CNumFormatter.prototype.NumPartsToString=function(aNumParts){function NZeros(aNumZeros){var zz='00000000000000000000';return zz.substr(0,aNumZeros);}
if(isNaN(aNumParts.Mant)||!isFinite(aNumParts.Mant))return aNumParts.Mant.toString();var numStr='';var mode=aNumParts.Mode;var zerosOnly=false;if(mode=='std'){var prec1=aNumParts.Precision-1;numStr=aNumParts.Mant.toExponential(prec1);var numStrParts=this.SplitNumStr(numStr);var mantStr=numStrParts.MantStr.replace('.','');var exp=numStrParts.Exp;if(exp>=0){if(exp<prec1){var p=exp+1;numStr=mantStr.substr(0,p)+'.'+mantStr.substr(p);}else{numStr=mantStr+NZeros(exp-prec1);}}else{numStr='0.'+NZeros(-exp-1)+mantStr;}
if(aNumParts.InitMode!=='prec'){numStr=this.CutTrailingZeros(numStr);}
numStr=this.FormatNumStr(numStr);}else if(mode=='prec'){numStr=aNumParts.Mant.toPrecision(aNumParts.Precision);numStr=this.FormatNumStr(numStr);}else if(mode=='fix'||mode=='fix0'||mode=='weak'||mode=='weak0'){numStr=aNumParts.Mant.toFixed(aNumParts.Precision);var nDigi=this.NDigits(numStr);if(nDigi>this.MaxPrec){var prec1=this.MaxPrec-1;var mantStr=aNumParts.Mant.toExponential(prec1);var numStrParts=this.SplitNumStr(mantStr);mantStr=numStrParts.MantStr.replace('.','');var exp=numStrParts.Exp;if(exp>=0){if(exp<prec1){var p=exp+1;numStr=mantStr.substr(0,p)+'.'+mantStr.substr(p);var nZeros=aNumParts.Precision-(this.MaxPrec-p);numStr+=NZeros(nZeros);}else{numStr=mantStr+NZeros(exp-prec1);if(mode=='fix0'||mode=='weak0'){if(aNumParts.Precision>0)numStr+='.'+NZeros(aNumParts.Precision);}}}}
if(mode=='fix'||mode=='weak')numStr=this.RemoveTrailingZeros(numStr);zerosOnly=(numStr.replace(/[\.0]/g,'')=='');numStr=this.FormatNumStr(numStr);}else{numStr=aNumParts.Mant.toFixed(aNumParts.Precision-1);if(aNumParts.InitMode=='std'){numStr=this.CutTrailingZeros(numStr);}
numStr=this.FormatNumStr(numStr);if(aNumParts.Exp>0||(!this.HideZeroExp&&aNumParts.PrefixIx==-1)){numStr+=(this.Lang=='calc'?'e':this.ExpChar);if(aNumParts.ExpSign<0){numStr+='-';}else if(this.ShowExpPlus){numStr+='+';}
numStr+=this.ExpToStr(aNumParts.Exp,this.ExpLeadZero);}}
if(aNumParts.MantSign<0&&!zerosOnly){numStr='-'+numStr;}
if(numStr!='NaN'&&aNumParts.Units!=''){numStr+=this.UnitSepChar;numStr+=this.GetPrefixFromNumParts(aNumParts);numStr+=aNumParts.Units;}
return numStr;}
CNumFormatter.prototype.NumToString=function(aNum,aFormat){var numParts=this.SplitNum(aNum,aFormat);return this.NumPartsToString(numParts);}
CNumFormatter.prototype.IsValidNumStr=function(s){var str=s.replace(/^ +/,'').replace(/ +$/,'');var normStr=this.NormalizeNumStr(str,true);var regex=new RegExp('^[+\\-]?\\d+(\\.\\d*)?( ?[Ee][+\\-]?\\d+)?$');return regex.test(normStr)?normStr:'';}
CNumFormatter.prototype.NormalizeNumStr=function(aStr,removeBlanks){function replaceRegExp(aSrcStr,aRegExpStr,aReplStr){return aSrcStr.replace(new RegExp(aRegExpStr,'g'),aReplStr);}
var s=aStr;var c=this.MantGrpChar;if(c!=''){if(c=='\\')c='\\\\';if(c==']')c='\\]';s=replaceRegExp(s,'['+c+']','');}
c=this.FracGrpChar;if(c!=''){if(c=='\\')c='\\\\';if(c==']')c='\\]';s=replaceRegExp(s,'['+c+']','');}
if(removeBlanks){s=replaceRegExp(s,' ','');}
if(this.DecimalChar==','){s=replaceRegExp(s,',','.');}
return s;}
CNumFormatter.prototype.StringToNum=function(aStr){var s=this.NormalizeNumStr(aStr,true);return Number(s);}
CNumFormatter.prototype.DegToDMS=function(x){var d=Math.abs(x);var s=x<0?-1:1;var r={sign:s,d:0,m:0,s:0};r.d=Math.floor(d);d=(d%1)*60;r.m=Math.floor(d);r.s=(d%1)*60;return r;}
CNumFormatter.prototype.FormatXms=function(num,format,prec){var saveMantGrpChar=this.MantGrpChar;var saveFracGrpChar=this.FracGrpChar;var saveDecimalChar=this.DecimalChar;this.MantGrpChar='';this.FracGrpChar='';this.DecimalChar='.';var sep1='°';var sep2='\'';var sep3='"';if(format=='hms'){sep1=':';sep2=':';sep3='';}
var dms=this.DegToDMS(num);var s='';var p='';if(format=='dmsS'||format=='dmS'){if(dms.sign<0){p=' S';}else{p=' N';}}else if(format=='dmsW'||format=='dmW'){if(dms.sign<0){p=' W';}else{p=' E';}}else if(format=='Sdms'||format=='Sdm'){if(dms.sign<0){s='S ';}else{s='N ';}}else if(format=='Wdms'||format=='Wdm'){if(dms.sign<0){s='W ';}else{s='E ';}}else{if(dms.sign<0){s='-';}}
if(prec<=0){if(dms.m>=30)dms.d+=1;s+=this.Format(dms.d,'fix',0);if(format!='hms')s+=sep1;s+=p;}else if(prec<=2){if(dms.s>=30)dms.m+=1;if(dms.m>=60){dms.d+=1;dms.m=0;}
var ms=this.Format(dms.m,'fix',0);if(ms.length<2)ms='0'+ms;s+=this.Format(dms.d,'fix',0)+sep1+ms;if(format!='hms')s+=sep2;s+=p;}else if(format.indexOf('dm')>=0&&format.indexOf('ms')<0){prec-=2;dms.m+=dms.s/60;if(prec<0)prec=0;var ms=this.Format(dms.m,'fix0',prec);if(ms.length<2||ms.indexOf(this.DecimalChar)==1)ms='0'+ms;if(ms.indexOf('60')==0){ms=ms.replace(/^6/,'0');dms.d+=1;}
s+=this.Format(dms.d,'fix',0)+sep1+ms+sep2;s+=p;}else{prec-=4;if(prec<0)prec=0;var ss=this.Format(dms.s,'fix0',prec);if(ss.length<2||ss.indexOf(this.DecimalChar)==1)ss='0'+ss;if(ss.indexOf('60')==0){ss=ss.replace(/^6/,'0');dms.m+=1;if(dms.m>=60){dms.d+=1;dms.m=0;}}
var ms=this.Format(dms.m,'fix',0);if(ms.length<2)ms='0'+ms;s+=this.Format(dms.d,'fix',0)+sep1+ms+sep2+ss;if(format!='hms')s+=sep3;s+=p;}
this.MantGrpChar=saveMantGrpChar;this.FracGrpChar=saveFracGrpChar;this.DecimalChar=saveDecimalChar;return s;}
CNumFormatter.prototype.HmsStrToNum=function(str){return this.DmsStrToNum(str,false);}
CNumFormatter.prototype.DmsStrToNum=function(str,acceptDirection){var normNumStr=this.IsValidNumStr(str);if(normNumStr!=''){return this.StringToNum(normNumStr);}
acceptDirection=xDefBool(acceptDirection,true);var neg=(str.indexOf('S')>=0||str.indexOf('s')>=0||str.indexOf('W')>=0||str.indexOf('w')>=0)?-1:1;if(acceptDirection){str=str.replace(/(^ *[nNsSeEwW])|([nNsSeEwW] *$)/g,'');}else{neg=1;}
str=str.replace(/^ +/,'').replace(/ +$/,'');str=str.replace(/^\\+/g,'');if(str.indexOf('-')==0){neg=-1;str=str.replace(/^-/g,'');}
if(str.indexOf('°')>0&&str.indexOf('"')>0&&str.indexOf('\'')<0){str=str.replace(/°/,'°0\'');}
if(str.indexOf('"')>0&&str.indexOf('\'')<0){str='0\''+str;}
if(str.indexOf('\'')>0&&str.indexOf('°')<0){str='0°'+str;}
str=str.replace(/[^0-9\.]/g,' ');str=str.replace(/ +/g,' ').replace(/^ /,'').replace(/ $/,'');if(str=='')return 0;var parts=str.split(' ');var res=0;var fract=1;var n=parts.length;if(n>3)n=3;for(var i=0;i<n;i++){var num=parseFloat(parts[i]);if(isNaN(num))break;res+=num/fract;fract*=60;}
return neg*res;}
CNumFormatter.prototype.DateStrToNum=function(str,zeroDate){var normNumStr=this.IsValidNumStr(str);if(normNumStr!=''){return parseInt(normNumStr);}
zeroDate=xDefNum(zeroDate,0);var del='.';if(str.indexOf('-')>0)del='-';if(str.indexOf('/')>0)del='/';str=str.replace(/[,\.\/\-]/g,' ');str=str.replace(/ +/g,' ').replace(/^ /,'').replace(/ $/,'');if(str=='')return 0;var parts=str.split(' ');var hasName=false;for(var i=0;i<parts.length;i++){if(!xIsNumeric(parts[i])){hasName=true;break;}}
if(!hasName){if(del=='.'&&parts.length>1){var month=parts[1];parts[1]=parts[0];parts[0]=month;}else if(del=='-'&&parts.length>2){var year=parts[0];parts[0]=parts[1];parts[1]=parts[2];parts[2]=year;}
str=parts.join('/');}
var ms=Date.parse(str);if(isNaN(ms))return 0;var res=Math.round(ms/86400000);return res-zeroDate;}
var NumFormatter=new CNumFormatter();