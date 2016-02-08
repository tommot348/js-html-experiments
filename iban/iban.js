var iban=function(blz,kto){
	var blznrtemp=new String(Math.floor(blz/97));
	var blzrest=blz%97;
	var blznr=new String(blz);
	var bban=(blznrtemp);
	var konto = new String(kto);
	while(konto.length<10){
		konto="0"+konto;
	};
	bban+=konto+"131400";
	alert(parseFloat(bban)+blzrest);
	var pruef=new String(98-parseInt(bban+blzrest)%97);
	pruef=pruef.length===1?pruef="0"+pruef:pruef;	
	return "DE" +pruef  + blznr+konto;
};