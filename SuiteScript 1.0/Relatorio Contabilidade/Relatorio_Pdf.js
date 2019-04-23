/**
*NOME DA CUSTOMZIAÇÃO: RELATÓRIO CONTABILIDADE
*TIPO DO SCRIPT: SUITELET
*DESEVOLVEDOR: RAFAEL FREITAS
*DATA DE CRIAÇÃO: 14/11/2018 
**/

function printItemBarcode(request, response)
{

	//Filtros da busca herdado do Relatorio Contabilidade
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

	//create a table to present the line items
	var strName = "<table font-size=\"8\">";
	//strName += "<tr border-style=solid>";
	strName += "<tr>";
	//strName += "<tr border-width=\"3\">";
	//tentar nas tds
	strName += "<td border='0.5pt solid black'><b>Data</b></td>";
	strName += "<td border='0.5pt solid black'><b>N.documento</b></td>";
	strName += "<td border='0.5pt solid black'><b>Pessoa</b></td>";
	strName += "<td border='0.5pt solid black'><b>Debito</b></td>";
	strName += "<td border='0.5pt solid black'><b>Credito</b></td>";
	strName += "<td border='0.5pt solid black'><b>Descrição</b></td>";
	strName += "<td border='0.5pt solid black'><b>Plano de contas</b></td>";
	strName += "<td border='0.5pt solid black'><b>Centro</b></td>";
	strName += "<td border='0.5pt solid black'><b>Departamento</b></td>";
	strName += "<td border='0.5pt solid black'><b>Saldo</b></td>";
	strName += "</tr>";

	//iterate through each item
		//var teste =searhResults;
	for(var x=0;searhResults != null && x < searhResults.length; x++)
	{
		strName += "<tr><td border='0.5pt solid black'>";

		// note the use of nlapiEscapeXML to escape any special characters, 
		// such as an ampersand (&) in any of the item names
		strName += nlapiEscapeXML(sub_data = searhResults[x].getValue('trandate'));
		strName += "</td>";
		strName += "<td border='0.5pt solid black'>";
		strName += sub_num_doc = searhResults[x].getValue('tranid');
		strName += "</td>";
		strName += "<td border='0.5pt solid black'>";
		strName += sub_pessoa = searhResults[x].getText('entity');
		strName += "</td>";
		strName += "<td border='0.5pt solid black'>";
		strName += sub_debito = searhResults[x].getValue('creditamount');
		strName += "</td>";
		strName += "<td border='0.5pt solid black'>";
		strName += sub_credito = searhResults[x].getValue('debitamount');
		strName += "</td>";
		strName += "<td border='0.5pt solid black'>";
		strName += sub_descricao = searhResults[x].getValue('memo');
		strName += "</td>";
		strName += "<td border='0.5pt solid black'>";
		strName +=  sub_plano_contas = searhResults[x].getText('account');
		strName += "</td>";
		strName += "<td border='0.5pt solid black'>";
		strName += sub_c_custo = searhResults[x].getText('class');
		strName += "</td>";
		strName += "<td border='0.5pt solid black'>";
		strName +=  sub_departamento = searhResults[x].getText('department');
		strName += "</td>";
	    strName += "<td border='0.5pt solid black'>";
		strName +=  saldo.toFixed(2);
		strName += "</td></tr>";
		var sub_debito = searhResults[x].getValue('debitamount');
		var sub_credito = searhResults[x].getValue('creditamount');

		if (sub_debito){
			saldo += parseFloat(sub_debito);
		}else if (sub_credito){
	    	saldo -= parseFloat (sub_credito);
		}
	}
	strName += "</table>";	

	// build up BFO-compliant XML using well-formed HTML
	var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
	xml += "<pdf>\n<body font-size=\"12\">\n<h3>Relatório contabilidade</h3>\n";
	xml += "<p>"
	xml += conta_name;
	xml += "</p>"
	xml += "<p>"
	xml += 'Período:' + inicio_pdf  + '\n até\n' + fim_pdf;
	xml += "</p>"
	xml += "<p>"
	xml += 'Data:\n'+ date;
	xml += "</p>"
	xml += "<p>"
	xml += 'Saldo Inicial:\n' +saldo_inicial;
	xml += "</p>"
	xml += strName;
	xml += "</body>\n</pdf>";

	// run the BFO library to convert the xml document to a PDF 
	var file = nlapiXMLToPDF( xml );

	// set content type, file name, and content-disposition (inline means display in browser)
	response.setContentType('PDF','PO_Item_Barcode.pdf', 'inline');
	
	// write response to the client
	response.write( file.getValue() );   
}