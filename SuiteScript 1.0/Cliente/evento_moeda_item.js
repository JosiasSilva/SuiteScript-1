function atualiza_cambio(type,form, request) {

    if (type == 'create'){
        
        var estimateid = request.getParameter('id');//id traz tabela
        var record = nlapiLoadRecord('estimate',estimateid);//carrega registro     
        var moeda =record.getFieldValue('custbody_moedaevento2');//Seleciono registro que quero editar 
        var taxa = getcambio(moeda);//atibuo valor da função em uma varivel
        //Atualiza a taxa de câmbio Cotação
        record.setFieldValue('custbody_taxaevento',taxa);
        nlapiSubmitRecord(record,true);

        //Atualiza a taxa de câmbio Pedido de vendas   record.setFieldValue('custbody_taxaevento',taxa);
        nlapiSetFieldValue('custbody_taxaevento',taxa);
       
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
}
