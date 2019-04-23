/**
*NOME DA CUSTOMZIAÇÃO: RELATÓRIO CONTABILIDADE
*TIPO DO SCRIPT: SUITELET
*DESEVOLVEDOR: RAFAEL FREITAS
*DATA DE CRIAÇÃO: 11/11/2018 
**/


function RelatorioContabilidade (){
    //Montando Layout
    if (request.getMethod() == 'GET' ){
        //criando formulário
        var form = nlapiCreateForm('Relatório Contabilidade');
        
        var conta = form.addField('conta','select','Conta').setLayoutType('midrow');	
        var inicio = form.addField('inicio','date','De').setLayoutType('midrow');
        var fim = form.addField('fim','date','Até').setLayoutType('midrow');
        var Filtrar = form.addSubmitButton('Filtrar');
 
        //Informando filtros da conta
        var filters = [];
        filters.push(new nlobjSearchFilter('type',null,'is','Bank'));
        filters.push(new nlobjSearchFilter('isinactive',null,'is','F'));
        //Informando colunas da conta
        var columns = [];	
        columns.push(new nlobjSearchColumn('name')); 
        columns.push(new nlobjSearchColumn('internalid'));

        //Informando tipo de registro da conta (tabela)
        var searhResults = nlapiSearchRecord('account',null,filters,columns);
        //Percorrendo registros da conta
        for(var i=0;searhResults != null && i < searhResults.length; i++)
        {			
            conta.addSelectOption(searhResults[i].getValue('internalid'),searhResults[i].getValue('name'));
        }
        response.writePage(form);
       
    }
    //Roda post após clicar no botão
    else{
        var form = nlapiCreateForm('Relatório Contabilidade');
       
        var conta_post = request.getParameter('conta');
        var record = nlapiLoadRecord('account',conta_post);
        var nome = record.getFieldValue('acctname');//Seleciono registro que quero editar 
        var inicio_post = request.getParameter('inicio');
        var fim_post = request.getParameter('fim');
        

        form.addButton('button_voltar', 'Novo', 'Voltar();');
        form.setScript('customscript_generate_pdf');//vai até o outro script cliente
        form.addButton('button_pdf', 'Gerar PDF', 'fxn_generatePDF();');
        form.setScript('customscript_generate_pdf');//vai até o outro script cliente
        form.addButton('button_xls', 'Gerar XLS','fxn_generateExcel();' );
    
        //Exibição dos filtros			

        var contafield = form.addField('inicio','text','De');		
		contafield.setDefaultValue(inicio_post);	
        contafield.setDisplayType('inline');

        var contafield = form.addField('fim','text','Até');		
		contafield.setDefaultValue(fim_post);	
        contafield.setDisplayType('inline');

        var contafield = form.addField('conta','text','Conta');		
		contafield.setDefaultValue(nome);	
        contafield.setDisplayType('inline');

        var contafield = form.addField('conta_id','text','Conta Id');		
		contafield.setDefaultValue(conta_post);	
        contafield.setVisible(false);



        //Sublista
        var sublist = form.addSubList('sub_resul', 'list', 'Relatório Contabilidade', 'resulTab');
        sublist.addField('date','date','Data');
        sublist.addField('num_doc','text','Num.Doc');
        sublist.addField('pessoa','text','Pessoa');
        sublist.addField('debito','text',' Débito');
        sublist.addField('credito','text', 'Crédito');
        sublist.addField('descricao','text', 'Descrição');
        sublist.addField('plano_contas','text', 'Plano Contas');
        sublist.addField('c_custo','text', 'C.Custo');
        sublist.addField('departamento','text', 'Departamento');
        sublist.addField('saldo','text', 'Saldo');

        
        //Filtro para calcular todos os valores da conta 
        var filters = [];
        filters.push(new nlobjSearchFilter('account',null,'is',conta_post));
        filters.push(new nlobjSearchFilter('trandate',null,'before',inicio_post));
           //Informando colunas da conta
        var columns = [];	
        columns.push(new nlobjSearchColumn('account')); 
        columns.push(new nlobjSearchColumn('debitamount'));
        columns.push(new nlobjSearchColumn('creditamount'));
                                 
        //Informando tipo de registro da conta (tabela)
        var searhResults = nlapiSearchRecord('journalentry',null,filters,columns);
        var debito = 0; 
        var credito = 0;
                    
        for(var i=0;searhResults != null && i < searhResults.length; i++){	
            if (searhResults[i].getValue('debitamount')) {    
                debito += parseFloat(searhResults[i].getValue('debitamount'));
            }
            else if(searhResults[i].getValue('creditamount')){
                credito += parseFloat(searhResults[i].getValue('creditamount')); 
            }       
        }

        var saldo = debito - credito;

    
        //Filtros de data e conta 
        var filters = [];
        filters.push(new nlobjSearchFilter('account',null,'is',conta_post));
        filters.push(new nlobjSearchFilter('trandate',null,'onorafter',inicio_post));
        filters.push(new nlobjSearchFilter('trandate',null,'onorbefore',fim_post));
        
        //Informando colunas da conta
        var columns = [];	
        columns.push(new nlobjSearchColumn('trandate'));
        columns.push(new nlobjSearchColumn('tranid'));
        columns.push(new nlobjSearchColumn('entity'));  
        columns.push(new nlobjSearchColumn('debitamount'));
        columns.push(new nlobjSearchColumn('creditamount'));
        columns.push(new nlobjSearchColumn('memo')); 
        columns.push(new nlobjSearchColumn('account')); 
        columns.push(new nlobjSearchColumn('class'));
        columns.push(new nlobjSearchColumn('department')); 

        //Informando tipo de registro da conta (tabela)
        var searhResults = nlapiSearchRecord('journalentry',null,filters,columns);
        //Percorrendo registros da conta
        var j=0;
        for(var i=0;searhResults != null && i < searhResults.length; i++)
        {	
            j++;		 
            var sub_data = searhResults[i].getValue('trandate');
            var sub_num_doc = searhResults[i].getValue('tranid');
            var sub_pessoa = searhResults[i].getText('entity');
            var sub_debito = searhResults[i].getValue('debitamount');
            var sub_credito = searhResults[i].getValue('creditamount');
            var sub_descricao = searhResults[i].getValue('memo');
            var sub_plano_contas = searhResults[i].getText('account');
            var sub_c_custo = searhResults[i].getText('class');
            var sub_departamento = searhResults[i].getText('department');
            //agrupa um ao lado do outro não soma 
           
            sublist.setLineItemValue('date', j, sub_data);
            sublist.setLineItemValue('num_doc', j ,sub_num_doc);
            sublist.setLineItemValue('pessoa', j , sub_pessoa);
            sublist.setLineItemValue('debito', j , sub_credito);
            sublist.setLineItemValue('credito', j , sub_debito);
            sublist.setLineItemValue('descricao', j , sub_descricao);
            sublist.setLineItemValue('plano_contas', j , sub_plano_contas);
            sublist.setLineItemValue('c_custo', j , sub_c_custo);
            sublist.setLineItemValue('departamento', j , sub_departamento);
            sublist.setLineItemValue('saldo', j , saldo.toFixed(2));
               
            if (sub_debito){
                saldo += parseFloat(sub_debito);

            }else if (sub_credito){
                saldo -= parseFloat (sub_credito);
            }
        }  
        response.writePage(form);

    }
}
