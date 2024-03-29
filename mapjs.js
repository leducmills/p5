"use strict";

function SoftFloat(){
	var b=0.2;
	var a=0.5;
	this.value=0;
	this.velocity=0;
	this.acceleration=0;
	this.damping=0;
	this.attraction=0;
	this.targeting=false;
	this.target=0;

	if(arguments.length===0){
		this.value=0;
		this.damping=a;
		this.attraction=b }else{ 
			if(arguments.length===1){
				this.value=arguments[0];
				this.damping=a;
				this.attraction=b }else {
					if(arguments.length===3){
						this.value=arguments[0];
						this.damping=arguments[1];
						this.attraction=arguments[2]
					}
				}
			}

			this.set=function(c){
				this.value=c;
				this.targeting=false };

			this.pin=function(){ 
				if(arguments.length==1){ 
					this.target=arguments[0]}this.value=this.target;
			this.targeting=false};

			this.get=function(){ 
				return this.value};

			this.getInt=function(){
				return Math.floor(this.value)};

			this.update=function(){
				if(this.targeting){
					this.acceleration+=this.attraction*(this.target-this.value);
					this.velocity=(this.velocity+this.acceleration)*this.damping;
					this.value+=this.velocity;this.acceleration=0;

					if(Math.abs(this.velocity)>0.00001){
						return true
					}   this.value=this.target;
						this.targeting=false}
						return false};

			this.setTarget=function(c){
				this.targeting=true;
				this.target=c};

			this.getTarget=function(){return this.target};this.isSet=function(){return this.getTarget()==1};this.toggle=function(){this.setTarget(this.getTarget()==1?0:1)}}"use strict";function hexToRgb(c){var b=/^#?([a-f\d])([a-f\d])([a-f\d])$/i;c=c.replace(b,function(e,h,f,d){return h+h+f+f+d+d});var a=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c);return a?{r:parseInt(a[1],16)/255,g:parseInt(a[2],16)/255,b:parseInt(a[3],16)/255}:null}function ColorFader(i,c){var k=new SoftFloat(1,0.5,0.5);this.colorValue=c;var g=hexToRgb(i);var d=hexToRgb(c);var e=g.r;var a=g.g;var h=g.b;var f=d.r-e;var b=d.g-a;var j=d.b-h;this.update=function(){var l=k.update();if(l){var m=k.get();this.colorValue="rgb("+Math.floor((e+f*m)*255)+", "+Math.floor((a+b*m)*255)+", "+Math.floor((h+j*m)*255)+")"}return l};this.targetLow=function(){k.setTarget(0)};this.targetHigh=function(){k.setTarget(1)}}"use strict";var remap=function(e,c,d,b,f){var a=b+(f-b)*((e-c)/(d-c));return a};var nf=function(b,a){return b.toFixed(a)};var zipdecode=function(){var au,s;var j=0;var a=true;var ag=0,af=0;var E=false;var W,G;var c=37;var C=3;var h=39;var y=8;var N=127;var aQ;var L;var aq=false;var z="#333333";var m="#999966";var aE="#CBCBCB";var ad="#66664C";var J="#CBCBCB";var F="#FFFF66";var aN=[];var aM,ar,aL,ap;var aC=0;var R=1;var Q=2;var l=3;var r;var T=[];var I;var x,aB;var w,aA;var aJ="";var ay=[];var e=0;var aP=[0,0,0,0,0,0];var ac;var o;var u=0;var aa=false;var n=new SoftFloat();var g=new SoftFloat();var aH=new SoftFloat();var f=new SoftFloat();var aF=new SoftFloat();var aj=[0,0,0,0,0,0];var P=[0,0,0,0,0,0];var ah=[0,0,0,0,0,0];var O=[0,0,0,0,0,0];var ax,ak;var aw,ai;var an=function(){L.font="400 15px Alegreya Sans";aN[0]=new ColorFader(ad,m);for(var X=1;X<6;X++){aN[X]=new ColorFader(ad,aE)}aD()};var az=function(){ax=x;ak=w;aw=aB;ai=aA;S();H(15);am()};var aD=function(){var X=new XMLHttpRequest();X.open("GET","zips.txt",true);X.onreadystatechange=function(){if(X.readyState===4){if(X.status===200){var Y=X.responseText.split("\n");V(Y[0]);for(var aR=1;aR<Y.length;aR++){T.push(new i(Y[aR]))}I=Y.length-1;az()}}};X.send(null)};var V=function(Y){var X=Y.substring(1).trim();var aR=X.split(",");r=parseInt(aR[0]);x=parseFloat(aR[1]);aB=parseFloat(aR[2]);w=parseFloat(aR[3]);aA=parseFloat(aR[4])};var ae=function(){++j;L.fillStyle=z;L.fillRect(0,0,au,s);U();aO();var X=40;var aR=s-40;if(e==0){L.fillStyle=J;p(c);var Y="zipdecode by ben fry";if(a){Y="type the digits of a zip code"}else{Y="click the map image to begin"}at(Y,X,aR)}else{if(ac>0){if(o!=null){o.drawChosen()}A(aE);p(c);at(aJ,X,aR)}else{A(F);at(aJ,X,aR)}}p(h);A(aa?aE:ad);at("zoom",au-X,aR);p(c)};var U=function(){var X=false;for(var Y=0;Y<6;Y++){X|=aN[Y].update()}if(ac>0){n.setTarget(e)}else{n.setTarget(e-1)}X|=n.update();X|=g.update();X|=aH.update();X|=f.update();X|=aF.update();if(!X){u++;if(u>20){k();u=0}}else{u=0}};var aI=function(X){if(aa){return remap(X,g.get(),f.get(),aM,aL)}else{return remap(X,aj[0],ah[0],aM,aL)}};var aG=function(X){if(aa){return remap(X,aH.get(),aF.get(),ap,ar)}else{return remap(X,P[0],O[0],ap,ar)}};var Z=function(X){if(X){if((ag>au-100)&&(af>s-50)){aa=!aa}}};var M="0".charCodeAt(0);var al="9".charCodeAt(0);var B=function(){if((W==y)||(W==N)){if(e>0){e--;aJ=aJ.substring(0,e)}S()}else{if(W>=M&&W<=al){var X=W-M;if(e!=5){if(ac>0){ay[e++]=X;aJ+=""+X}}S()}else{if(W=="Z".charCodeAt(0)){aa=!aa;K();am()}}}};var S=function(){for(var Y=0;Y<e;Y++){aN[Y].targetLow()}for(var Y=e;Y<6;Y++){aN[Y].targetHigh()}aP[e]=parseInt(aJ)||0;for(var X=e-1;X>0;--X){aP[X]=Math.floor(aP[X+1]/10)}ac=0;o=null;ax=aB;ak=aA;aw=x;ai=w;for(var Y=0;Y<I;Y++){T[Y].check()}K();am()};var K=function(Y){if(ac!=0||Y){var aU=(aw-ax);var aT=(ai-ak);var aR=(ax+aw)/2;var X=(ak+ai)/2;if((aU!=0)&&(aT!=0)){var aV=au/s;var aS=aU/aT;if(aS>aV){aT=(aU/au)*s}else{aU=(aT/s)*au}}else{aU=ah[e-1]-aj[e-1];aT=O[e-1]-P[e-1]}aj[e]=aR-aU/2;ah[e]=aR+aU/2;P[e]=X-aT/2;O[e]=X+aT/2}else{if(e!=0){aj[e]=aj[e-1];P[e]=P[e-1];ah[e]=ah[e-1];O[e]=O[e-1]}}g.setTarget(aj[e]);aH.setTarget(P[e]);f.setTarget(ah[e]);aF.setTarget(O[e]);if(!aa){g.set(g.getTarget());aH.set(aH.getTarget());f.set(f.getTarget());aF.set(aF.getTarget())}};var i=function(X){var Y=X.split("\t");this.code=Y[aC];this.name=Y[l];this.x=parseFloat(Y[R]);this.y=parseFloat(Y[Q]);var aR=parseInt(this.code);this.partial=[-1,Math.floor(aR/10000),Math.floor(aR/1000),Math.floor(aR/100),Math.floor(aR/10),aR];this.matchDepth=0;this.setPartials=function(){for(var aS=e;aS>0;--aS){if(aP[aS]==this.partial[aS]){this.matchDepth=aS;return}}};this.check=function(){this.matchDepth=0;if(e!=0){this.setPartials()}if(this.matchDepth==e){ac++;if(e==5){o=this}if(this.x<ax){ax=this.x}if(this.y<ak){ak=this.y}if(this.x>aw){aw=this.x}if(this.y>ai){ai=this.y}}};this.draw=function(){var aS=aI(this.x);var aU=aG(this.y);if((aS<0)||(aU<0)||(aS>=au)||(aU>=s)){return}if((n.value<2.8)||!aa){ab(aS,aU,1,1)}else{if(this.matchDepth==e){if(e==4){var aT=(parseInt(this.code)||0)%10;at(""+aT,aS,aU)}else{ab(aS,aU,n.value)}}else{ab(aS,aU,n.value-1)}}};this.drawChosen=function(){A(aN[this.matchDepth].colorValue);var aY=aa?6:4;var aW=aI(this.x);var aT=aG(this.y);ab(aW,aT,aY);var aV=aW;var aS=aT-aY-4;if(aS<20){aS=aT+20}if(aS>s-5){aS=aT-20}var aU=this.name+"  "+this.code;if(aa){p(C);at(aU,aV,aS)}else{var aX=b(aU);if(aV>au/3){aV-=aX+8}else{aV+=8}p(c);A(aE);at(aU,aV,aS)}}};var aO=function(){for(var Y=0;Y<=e;Y++){L.fillStyle=aN[Y].colorValue;for(var X=0;X<I;X++){if(T[X].matchDepth==Y){T[X].draw()}}}};var D=null;var aK;var H=function(X){aK=1000/X;if(D!=null){k();am()}};var am=function(){if(D==null){D=setInterval(ae,aK)}};var k=function(){if(D!=null){clearInterval(D);D=null}};var A=function(X){L.fillStyle=X};var ab=function(X,aR,Y){L.fillRect(X-Y/2,aR-Y/2,Y,Y)};var v=function(X,aR,Y){L.beginPath();L.arc(X,aR,Y,Y,2*Math.PI);L.fill()};var at=function(Y,X,aR){L.fillText(Y,X,aR)};var p=function(X){if(X==c){L.textAlign="left"}else{if(X==C){L.textAlign="center"}else{if(X==h){L.textAlign="right"}}}};var b=function(Y){var X=L.measureText(Y);return X.width};var t=0;var q=0;var av=1;var d=function(){if(aq){aQ.width=window.innerWidth;aQ.height=window.innerHeight}au=aQ.width;s=aQ.height;aM=30;aL=au-aM;ar=20;ap=s-ar;if(window.devicePixelRatio){var Y=window.devicePixelRatio;if(Y>1){var aR=au;var X=s;$(aQ).attr("width",au*Y);$(aQ).attr("height",s*Y);$(aQ).css("width",aR);$(aQ).css("height",X);L.setTransform(Y,0,0,Y,0,0)}}K(true)};var ao=function(){aQ=document.getElementById("zipdecode");L=aQ.getContext("2d");d();if(aq){window.addEventListener("resize",d,false)}function aR(aV,aU){aV.preventDefault();var aS=aV.targetTouches[aV.targetTouches.length-1];var aT=$("canvas").offset();ag=((aS.pageX-aT.left)-t)/av;af=((aS.pageY-aT.top)-q)/av;Z(aU)}function X(aU,aT){aU.preventDefault();var aS=$("canvas").offset();ag=((aU.pageX-aS.left)-t)/av;af=((aU.pageY-aS.top)-q)/av;Z(aT)}if((/ipad/gi).test(navigator.appVersion)||(/iphone/gi).test(navigator.appVersion)||(/android/gi).test(navigator.appVersion)){aQ.addEventListener("touchstart",function(aS){E=true;aR(aS,true)},false);aQ.addEventListener("touchmove",function(aS){aR(aS,false)},false);aQ.addEventListener("touchend",function(aS){E=false;aR(aS,false)},false)}else{aQ.addEventListener("mousedown",function(aS){E=true;X(aS,true)},false);aQ.addEventListener("mousemove",function(aS){X(aS,false)},false);aQ.addEventListener("mouseup",function(aS){X(aS,false);E=false},false)}window.addEventListener("keydown",function(aS){W=aS.which;G=aS.keyCode;B()},false);var Y=function(aS){var aT;if(window.event){aT=window.event.keyCode}else{if(aS.which){aT=aS.which}}if(aT==y){return false}return true};document.onkeydown=Y;document.onkeypress=Y};ao();an()};new zipdecode();