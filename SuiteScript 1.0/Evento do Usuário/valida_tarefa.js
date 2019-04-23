function afterSubmit (type){
    if (type == 'edit'){
        
        var data = dataAtualFormatada();  

        var projeto = nlapiGetFieldValue('company');
        var record = nlapiLoadRecord('job' ,projeto);
        var recordType = record.getFieldValue('baserecordtype');

        if (recordType == 'job' || recordType == 'projectTask'){    
            record.setFieldValue('custentity_ykp_data_tarefa',data);
            
            var data_inicial = record.getFieldValue('startdate');
            var data_termino = record.getFieldValue('calculatedenddate');
            var data_referencia = record.getFieldValue('lastbaselinedate');
            var dataref = data_referencia;
            var datater = data_termino; 
            data_inicial = nlapiStringToDate(data_inicial);
            data_termino = nlapiStringToDate(data_termino);
            data_referencia = nlapiStringToDate(data_referencia);

            if(data_termino < data_referencia){
                record.setFieldValue('custentity_ykp_validacao_data',3);
            }
            else {
            record.setFieldValue('custentity_ykp_validacao_data',1);
            }
            nlapiSubmitRecord(record, true);  
        }    
    }
}
function beforesubmit(type){
    if (type == 'edit'){
        var data = dataAtualFormatada();  
        //valores do form tarefas
        var recordType =  nlapiGetFieldValue('baserecordtype');
        if (recordType == 'job' || recordType == 'projectTask'){    

            var tarefa = nlapiLoadRecord('projectTask',nlapiGetFieldValue('id'));
            var taref_final = tarefa.getFieldValue('enddate');
            var tarefa_ini = tarefa.getFieldValue('startdate');

            taref_final = nlapiStringToDate(taref_final);
            tarefa_ini = nlapiStringToDate(tarefa_ini);
            data = nlapiStringToDate(data);

            if  (taref_final < data || tarefa_ini < data){
                nlapiSetFieldValue('custevent_ykp_data_valida',3);
            }
            else {
                nlapiSetFieldValue('custevent_ykp_data_valida',1);
            }
        }
    }
}
function dataAtualFormatada(){
    var data = new Date(),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(),
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
}
