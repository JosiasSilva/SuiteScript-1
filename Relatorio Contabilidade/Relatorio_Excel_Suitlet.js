/**
*NOME DA CUSTOMZIAÇÃO: RELATÓRIO CONTABILIDADE
*TIPO DO SCRIPT: SUITELET
*DESEVOLVEDOR: RAFAEL FREITAS
*DATA DE CRIAÇÃO: 15/11/2018 
**/

function relatorio_excel_suitlet(request, response){

        var conta_name = request.getParameter('conta');
        var conta_pdf = request.getParameter('conta_id');
        var inicio_pdf = request.getParameter('inicio');
        var fim_pdf = request.getParameter('fim');
        var date =new Date();
        date = nlapiDateToString(date);

        //Filtro para calcular todos os valores da conta 
        var filters = [];
        filters.push(new nlobjSearchFilter('account',null,'is',conta_pdf));
        filters.push(new nlobjSearchFilter('trandate',null,'before',inicio_pdf));

        //Informando colunas da conta
        var columns = [];	
        columns.push(new nlobjSearchColumn('account')); 
        columns.push(new nlobjSearchColumn('debitamount'));
        columns.push(new nlobjSearchColumn('creditamount'));
                                    
        //Informando tipo de registro da conta (tabela)
        var searhResults = nlapiSearchRecord('journalentry',null,filters,columns);

        //Saldo inicial
        var saldo_inicial = 0;
        saldo_inicial =(searhResults[0].getValue('debitamount'));

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
        // saldo.toFixed(2);

        //Filtros de data e conta 
        var filters = [];
        filters.push(new nlobjSearchFilter('account',null,'is',conta_pdf));
        filters.push(new nlobjSearchFilter('trandate',null,'onorafter',inicio_pdf));
        filters.push(new nlobjSearchFilter('trandate',null,'onorbefore',fim_pdf));
        
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

    	//Filtros da busca herdado do Relatorio Contabilidade
    // XML content of the file
    var xmlStr = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>';
    xmlStr += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" ';
    xmlStr += 'xmlns:o="urn:schemas-microsoft-com:office:office" ';
    xmlStr += 'xmlns:x="urn:schemas-microsoft-com:office:excel" ';
    xmlStr += 'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" ';
    xmlStr += 'xmlns:html="http://www.w3.org/TR/REC-html40">';

    xmlStr += '<Worksheet ss:Name="Sheet1">';
    xmlStr += '<Table>' +
    
    '<Row>' +
    '<Cell><Data ss:Type="String">'+ conta_name +'</Data></Cell>' +
    '</Row>';

    xmlStr += '<Row>' +
    '<Cell><Data ss:Type="String">Período:'+ inicio_pdf +'</Data></Cell>' +
    '<Cell><Data ss:Type="String">Até:'+ fim_pdf +'</Data></Cell>' +
    '</Row>';

    xmlStr += '<Row>' +
    '<Cell><Data ss:Type="String">Data:'+ date +'</Data></Cell>' +
    '</Row>';

    xmlStr += '<Row>' +
    '<Cell><Data ss:Type="String">Saldo Inicial:'+ saldo_inicial +'</Data></Cell>' +
    '</Row>';

    xmlStr +='<Row>' +
    '<Cell><Data ss:Type="String"> Data </Data></Cell>' +
    '<Cell><Data ss:Type="String"> N.documento</Data></Cell>' +
    '<Cell><Data ss:Type="String"> Pessoa </Data></Cell>' +
    '<Cell><Data ss:Type="String"> Debito </Data></Cell>' +
    '<Cell><Data ss:Type="String"> Credito </Data></Cell>' +
    '<Cell><Data ss:Type="String"> Descrição </Data></Cell>' +
    '<Cell><Data ss:Type="String"> Plano de contas </Data></Cell>' +
    '<Cell><Data ss:Type="String"> Centro </Data></Cell>' +
    '<Cell><Data ss:Type="String"> Departamento </Data></Cell>' +
    '<Cell><Data ss:Type="String"> Saldo </Data></Cell>' +
    '</Row>';

  for(var x=0;searhResults != null && x < searhResults.length; x++)
  
  {
    
    sub_data = searhResults[x].getValue('trandate');
    sub_num_doc = searhResults[x].getValue('tranid');
    sub_pessoa = searhResults[x].getText('entity');
    sub_debito = searhResults[x].getValue('creditamount');
    sub_credito = searhResults[x].getValue('debitamount');
    sub_descricao = searhResults[x].getValue('memo');
    sub_plano_contas = searhResults[x].getText('account');
    sub_c_custo = searhResults[x].getText('class');
    sub_departamento = searhResults[x].getText('department');
    saldo.toFixed(2);
    var sub_debito = searhResults[x].getValue('debitamount');
	var sub_credito = searhResults[x].getValue('creditamount');

		if (sub_debito){
			saldo += parseFloat(sub_debito);
		}else if (sub_credito){
	    	saldo -= parseFloat (sub_credito);
		}
	

    xmlStr += '<Row>' +
    '<Cell><Data ss:Type="String">'+ sub_data +'</Data></Cell>' +
    '<Cell><Data ss:Type="String">'+ sub_num_doc +'</Data></Cell>' + 
    '<Cell><Data ss:Type="String">'+ sub_pessoa +'</Data></Cell>' +
    '<Cell><Data ss:Type="String">'+ sub_debito +'</Data></Cell>' + 
    '<Cell><Data ss:Type="String">'+ sub_credito +'</Data></Cell>' +
    '<Cell><Data ss:Type="String">'+ sub_descricao +'</Data></Cell>' + 
    '<Cell><Data ss:Type="String">'+ sub_plano_contas +'</Data></Cell>' +
    '<Cell><Data ss:Type="String">'+ sub_c_custo +'</Data></Cell>' + 
    '<Cell><Data ss:Type="String">'+ sub_departamento +'</Data></Cell>' +
    '<Cell><Data ss:Type="String">'+ saldo.toFixed(2) +'</Data></Cell>' + 
    '</Row>';

  }

    xmlStr += '</Table></Worksheet></Workbook>';

//create file
var xlsFile = nlapiCreateFile('relatorio.xls', 'EXCEL', nlapiEncrypt(xmlStr, 'base64'));

// folder id in which the file file will be saved
xlsFile.setFolder(8);

var form = nlapiCreateForm('');
//form.addButton('button_voltar', 'Novo', 'Voltar();');
form.setScript('customscript_baixar_excel');

//save file
var fileID = nlapiSubmitFile(xlsFile);
response.writePage(form);

}