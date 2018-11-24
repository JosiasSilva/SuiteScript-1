/**
*NOME DA CUSTOMZIAÇÃO: RELATÓRIO CONTABILIDADE
*TIPO DO SCRIPT: *TIPO DO SCRIPT: SUITELET
*DESEVOLVEDOR: RAFAEL FREITAS
*DATA DE CRIAÇÃO: 15/11/2018 
**/

function fxn_generatePDF()
{
  //call the Suitelet created in Step 1
  var createPDFURL = nlapiResolveURL('SUITELET', 'customscript_sample_pdf', 'customdeploy_sample_pdf', false);

  var conta_id = nlapiGetFieldValue('conta_id');
  var conta = nlapiGetFieldValue('conta');
  var inicio = nlapiGetFieldValue('inicio');
  var fim = nlapiGetFieldValue('fim');

  createPDFURL += '&conta_id=' + conta_id;
  createPDFURL += '&conta=' + conta;
  createPDFURL += '&inicio=' + inicio;
  createPDFURL += '&fim=' + fim;
 
  //show the PDF file 
  newWindow = window.open(createPDFURL);
  
}

function fxn_generateExcel(){
  var createExcelURL = nlapiResolveURL('SUITELET', 'customscript_ykp_relatorio_excel_sl', 'customdeploy_ykp_relatorio_excel_sl', false);

  var conta_id = nlapiGetFieldValue('conta_id');
  var conta = nlapiGetFieldValue('conta');
  var inicio = nlapiGetFieldValue('inicio');
  var fim = nlapiGetFieldValue('fim');

  createExcelURL += '&conta_id=' + conta_id;
  createExcelURL += '&conta=' + conta;
  createExcelURL += '&inicio=' + inicio;
  createExcelURL += '&fim=' + fim;
 
  //show the PDF file 
  newWindow = window.open(createExcelURL);
}

function Voltar(){
  var relatorio = nlapiResolveURL('SUITELET', 'customscript_ykp_relatorio_contabilidade', 'customdeploy1', false);

  newWindow = window.open(relatorio);
}
