import { v4 as uuidv4 } from 'uuid';
export function generateVoucherXml(csvRow, companyId = 123234) {
    /** date:infor[0],
        vtype:infor[1],
        refNo:infor[2],
        drLed:infor[3],
        crLed:infor[4],
        amt:infor[5],
        narration:infor[6]
     */
   
    let uuid = uuidv4();
    let cdtrData = {
        REMOVEZEROENTRIES: "No",
        ISDEEMEDPOSITIVE: "No",
        LEDGERNAME: csvRow.crLed,
        AMOUNT: csvRow.amt
    }
    let dbtrData = {
        REMOVEZEROENTRIES: "No",
        ISDEEMEDPOSITIVE: "Yes",
        LEDGERNAME: csvRow.drLed,
        AMOUNT: -csvRow.amt
    }
    let otherDate = {
        VOUCHERTYPENAME: csvRow.vtype,
        DATE: csvRow.date,
        EFFECTIVEDATE: csvRow.date,
        REFERENCE: csvRow.refNo,
        NARRATION: csvRow.narration,
        GUID: uuid,
        ALTERID: companyId
    }
    let otherDateXml = OBJtoXMLnoRoot(otherDate)
    let cdtrDataXml = OBJtoXML(cdtrData, "ALLLEDGERENTRIES.LIST")
    let dbtrDataXml = OBJtoXML(dbtrData, "ALLLEDGERENTRIES.LIST")
    let voucher = '<VOUCHER REMOTEID="' + uuid + '" VCHTYPE="' + csvRow.vtype + '" ACTION="Create">'
    let xml = '<TALLYMESSAGE xmlns:UDF="TallyUDF">' + voucher + otherDateXml + cdtrDataXml + dbtrDataXml + "</VOUCHER></TALLYMESSAGE>"
    return xml
}

function OBJtoXML(obj, rootTag) {
    var xml = '<' + rootTag + '>';
    for (var prop in obj) {
        xml += "<" + prop + ">";
        xml += obj[prop];
        xml += "</" + prop + ">";
    }
    xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    xml = xml + "</" + rootTag + ">"
    return xml
}
function OBJtoXMLnoRoot(obj) {
    var xml = '';
    for (var prop in obj) {
        xml += "<" + prop + ">";
        xml += obj[prop];
        xml += "</" + prop + ">";
    }
    xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    return xml
}