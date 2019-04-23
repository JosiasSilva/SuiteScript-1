/*CLIENTE: NUSSED 
CUSTOMIZAÇÃO: LUCRO/PREJUÍZO
TIPO: UPDATE MASS
DESENVOLVEDOR: rafael.freitas
DATA DE CRIAÇÃO: 21/02/2019
DATA ULTIMA ALTERAÇÃO:
ULTIMO DESENVOLVEDOR QUE EDITOU:*/

function ykp_lucro_preju(rec_type, rec_id){

    var icms = 0 ;
    var custo_linha = 0 ;
    var custo_linha_acumulado = 0 ;
    var rec_recod = nlapiLoadRecord(rec_type, rec_id);
    var subsidiaria = rec_recod.getFieldValue('subsidiary')
    
    if (subsidiaria == 55){
        for (j=1; j <= rec_recod.getLineItemCount('item'); j++){	
            var id_item = rec_recod.getLineItemValue('item', 'item',j);
            var type_item = rec_recod.getLineItemValue('item', 'itemtype',j);
            var custo_linha = rec_recod.getLineItemValue('item', 'costestimate',j);
            var total = rec_recod.getLineItemValue('item', 'amount',j);
            
            if (type_item === 'Assembly'){
                var item_load = nlapiLoadRecord('assemblyitem', id_item);	
                var crop_type = item_load.getFieldText('custitemcustcol_f5_sub_type');
                rec_recod.setLineItemValue('item','custcol_ykp_crop_subtype',j, crop_type);
            }

            for (i=1; i <= rec_recod.getLineItemCount('recmachcustrecord_enl_tt_orderid'); i++){

                var id_taxa = rec_recod.getLineItemValue('recmachcustrecord_enl_tt_orderid','custrecord_enl_tt_item',i);
                var name_icms =  rec_recod.getLineItemValue('recmachcustrecord_enl_tt_orderid','custrecord_enl_taxcode',i);
                var validaca_icms = 'icms';

                if (id_item == id_taxa && name_icms == validaca_icms){
                    var icms = rec_recod.getLineItemValue('recmachcustrecord_enl_tt_orderid','custrecord_enl_taxamount',i);
                    if(icms == null){
                        icms = 0 ;
                    }
                   
                    var bruto = total - icms;
                    var total_bruto = bruto; 
                    var bruto_aju = bruto.toFixed(2); 
                    rec_recod.setLineItemValue('item','custcol_ykp_valor_sem_imposto',j , bruto_aju);
                    
    
                    rec_recod.setLineItemValue('item','custcol_ykp_cost_estimate',j , custo_linha);

                    var lucro_preju = total_bruto - custo_linha;
                    var lucro_ajus = lucro_preju.toFixed(2);

                    rec_recod.setLineItemValue('item','custcol_ykp_lucro_prejuizo',j, lucro_ajus);

                }

            }
        }
        nlapiSubmitRecord(rec_recod, true);
    } 
}