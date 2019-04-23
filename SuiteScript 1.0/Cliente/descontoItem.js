function LineItem() {
    var rec = nlapiGetNewRecord();
    var lines = rec.getLineItemCount('item');
	var sub =nlapiGetSubsidiary();
  	var desconto_parametro = getpercentdesconto(sub);
    
    //percorrendo linha do item 
    for (var i = 1 ; i<= lines ; i++ ) {
        var desconto_linha = rec.getLineItemValue('item', 'custcol2', i);
    
    // comparação de valores 
        if (!desconto_parametro){
            return 1;
        }
        if (parseFloat(desconto_linha) >= parseFloat(desconto_parametro)){
            return 1;
        }
    }
    return 0;
}

//Select para buscar campo criado 
function getpercentdesconto(subsidiary){
  var filters = [];
	filters.push(new nlobjSearchFilter('internalid',null,'is',subsidiary));		
    //Campo que desejo pegar 
	var columns = [];
	columns.push(new nlobjSearchColumn('custrecord_perc_desconto'));		
    //nome do registro
    var searhResults = nlapiSearchRecord('subsidiary',null,filters,columns);
    //setando valor em uma variavel 
	var desconto_parametro= searhResults[0].getValue('custrecord_perc_desconto');
	return desconto_parametro;
}