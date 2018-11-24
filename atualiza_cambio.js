function atualiza_cambio(type,form, request) {

    if (type == 'create' && request.getParameter('id')){
        
        var estimateid = request.getParameter('id');//id traz tabela
        var record = nlapiLoadRecord('estimate',estimateid);//carrega registro     
        var moeda = record.getFieldValue('custbody_moedaevento2');//Seleciono registro que quero editar 
        var taxa = getcambio(moeda);//atibuo valor da função em uma varivel
        //Atualiza a taxa de câmbio Cotação
        record.setFieldValue('custbody_taxaevento',taxa);
        //Chamo tudo que tem no record e entro no item 
        var lineCount= record.getLineItemCount('item');
        //percorrer todas as linhas do item  
        for(var line=1; line <= lineCount; line++){
            var quantity = nlapiGetLineItemValue('item','quantity', line);
            var valor = nlapiGetLineItemValue('item','custcol_valortotalmoedaevento', line);
            var valoritem= (valor*taxa)*quantity;
            
            if(quantity >= 1){
                //Atualiza valor pedido de vendas
                nlapiSetLineItemValue('item','rate',line, valoritem);
                nlapiSetLineItemValue('item','amount',line, valoritem);
                //Atualiza valor cotação
                record.setLineItemValue('item','amount',line, valoritem);
                record.setLineItemValue('item','rate',line, valoritem);
               }

        }
        nlapiSubmitRecord(record,true);

        //Atualiza a taxa de câmbio Pedido de vendas   record.setFieldValue('custbody_taxaevento',taxa);
        nlapiSetFieldValue('custbody_taxaevento',taxa);
       
    }
}

//trazendo valor atual da taxa 
function getcambio(moeda){
    var filters = [];
    //Função para pegar a moeda base
    filters.push(new nlobjSearchFilter('basecurrency',null,'is',getmoedatransacao()));	
    //Função para pegar a moeda estrangeira
    filters.push(new nlobjSearchFilter('transactioncurrency',null,'is',moeda));		
    //Data e Taxa 
    var columns = [];		
    columns[0] = new nlobjSearchColumn('exchangerate');
    columns[1] = new nlobjSearchColumn('effectivedate');
    //Pega o ultimo valor adicionado 
    columns[1].setSort(true)
    
    var searhResults = nlapiSearchRecord('currencyrate',null,filters,columns);

    var taxacambio = searhResults[0].getValue('exchangerate');
    return taxacambio;
}

    //Verifica qual é Subsidiary
    function getmoedatransacao(){
        var filters = [];
        filters.push(new nlobjSearchFilter('internalid',null,'is',nlapiGetSubsidiary()));		
        
        var columns = [];
        columns.push(new nlobjSearchColumn('currency'));		
        
        var searhResults = nlapiSearchRecord('subsidiary',null,filters,columns);
    
        var moedatransacao = searhResults[0].getValue('currency');
        return moedatransacao;
    
}
