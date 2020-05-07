import React, { Component } from 'react';
import './App.css';
import { generateVoucherXml } from './voucherGenerator';

const Results = (props) => (
  <div id="results" className="results" style={{ display: props.show ? "block" : "none" }}>
    <div className="header">
      <button onClick={() => props.toggle()} className="btn btn-sm btn-danger">close</button>
    </div>
    <div className="body">{props.value}</div>
  </div>
)

class App extends Component {
  state = {
    csvString: "",
    xml: "",
    dataList: [],
    selectedFile: "",
    showResult: false
  }
  openFile() {
    this.refs.fileSelector.click()
  }
  readInputFile(event) {
    let self = this;
    let fileReader = new FileReader();
    let filename = event.target.files[0].name
    fileReader.readAsText(event.target.files[0], "UTF-8");
    fileReader.onload = () => {
      let data = fileReader.result.trim()
      self.setState({ csvString: data });
    }
    this.setState({ selectedFile: filename })
  }

  processCSV() {
    let content = this.state.csvString.split("\n")
    let data = []
    console.debug(content);
    if (Array.isArray(content)) {
      for (let i = 1; i < content.length; i++) {
        console.debug(content[i]);
        let infor = content[i].split(",")
        if (Array.isArray(infor)) {
          let csvData = {
            date: infor[0],
            vtype: infor[1],
            refNo: i,
            drLed: infor[3],
            crLed: infor[4],
            drAmt: infor[5],
            crAmt: infor[6],
            amt: infor[5] + infor[6],
            narration: infor[7]
          }
          data.push(csvData);
        }
      }
      this.setState({
        dataList: data
      })
    } else {
      alert("invalid data")
    }
  }

  generateXML() {
    let csv = this.state.dataList;
    let entries = "<ENVELOPE><HEADER><TALLYREQUEST>Import Data</TALLYREQUEST></HEADER><BODY><IMPORTDATA><REQUESTDESC><REPORTNAME>Vouchers</REPORTNAME><STATICVARIABLES><SVCURRENTCOMPANY></SVCURRENTCOMPANY></STATICVARIABLES></REQUESTDESC><REQUESTDATA>"
    csv.forEach((x, i) => {
      let y = generateVoucherXml(x, i)
      entries += y
    })
    entries += "</REQUESTDATA></IMPORTDATA></BODY></ENVELOPE>"

    this.setState({ xml: entries, showResult: true })
  }

  OBJtoXML(obj, rootTag) {
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
  toggleResult() {
    let current = this.state.showResult
    this.setState({
      showResult: !current
    })
  }
  handelDrRowChange(e, index) {
    let rowValue = e.target.value
    let newDataList = this.state.dataList
    newDataList[index]['drLed'] = rowValue;
    this.setState({ dataList: newDataList });
  }
  handelCrRowChange(e, index) {
    let rowValue = e.target.value
    let newDataList = this.state.dataList
    newDataList[index]['crLed'] = rowValue;
    this.setState({ dataList: newDataList });
  }
  handelvTypeRowChange(e, index) {
    let rowValue = e.target.value
    let newDataList = this.state.dataList
    newDataList[index]['vtype'] = rowValue;
    this.setState({ dataList: newDataList });
  }
  render() {

    let tdata = this.state.dataList.map((data, index) => {
      return (
        <tr key={index}>
          <td>{data.date}</td>
          <td>
            <select key={index} value={data.vtype} onChange={(e) => this.handelvTypeRowChange(e, index)}>
              <option value=''></option>
              <option value='Contra'>Contra</option>
              <option value='Credit Note'>Credit Note</option>
              <option value='Debit Note'>Debit Note</option>
              <option value='Delivery Note'>Delivery Note</option>
              <option value='Job Work In Order'>Job Work In Order</option>
              <option value='Job Work Out Order'>Job Work Out Order</option>
              <option value='Journal'>Journal</option>
              <option value='Material In'>Material In</option>
              <option value='Material Out'>Material Out</option>
              <option value='Memorandum'>Memorandum</option>
              <option value='Payment'>Payment</option>
              <option value='Physical Stock'>Physical Stock</option>
              <option value='Purchase'>Purchase</option>
              <option value='Purchase Order'>Purchase Order</option>
              <option value='Receipt'>Receipt</option>
              <option value='Receipt Note'>Receipt Note</option>
              <option value='Rejections In'>Rejections In</option>
              <option value='Rejections Out'>Rejections Out</option>
              <option value='Reversing Journal'>Reversing Journal</option>
              <option value='Sales'>Sales</option>
              <option value='Sales Order'>Sales Order</option>
              <option value='StockJournal'>StockJournal</option>
            </select>
          </td>
          <td>{data.refNo}</td>
          <td>
            <select key={index} value={data.drLed} onChange={(e) => this.handelDrRowChange(e, index)}>
              <option value=''></option>
              <option value='HDFC - FD'>HDFC - FD</option>
              <option value='Syndicate Bank - FD'>Syndicate Bank - FD</option>
              <option value='HDFC Diners Premium Cr Card'>HDFC Diners Premium Cr Card</option>
              <option value='SBI IRCTC Cr Card'>SBI IRCTC Cr Card</option>
              <option value='HDFC Diners Black Cr Card'>HDFC Diners Black Cr Card</option>
              <option value='Professional Fees Received'>Professional Fees Received</option>
              <option value='Professional Fees Paid'>Professional Fees Paid</option>
              <option value='Travel Expenses'>Travel Expenses</option>
              <option value='Staff Welfare'>Staff Welfare</option>
              <option value='Conveyance Expenses'>Conveyance Expenses</option>
              <option value='Communication Expenses'>Communication Expenses</option>
              <option value='Vehicle Maintenance'>Vehicle Maintenance</option>
              <option value='Life Insurance Premium'>Life Insurance Premium</option>
              <option value='Interest Received - SB'>Interest Received - SB</option>
              <option value='Interest Received - FD'>Interest Received - FD</option>
              <option value='Public Provident Fund'>Public Provident Fund</option>
              <option value='Drawings'>Drawings</option>
              <option value='TDS Deducted FY 2019 -20'>TDS Deducted FY 2019 -20</option>
              <option value='Mediclaim Insurance'>Mediclaim Insurance</option>
              <option value='Suspense'>Suspense</option>

            </select>
          </td>
          <td>
            <select key={index} value={data.crLed} onChange={(e) => this.handelCrRowChange(e, index)}>
              <option value=''></option>
              <option value='HDFC - FD'>HDFC - FD</option>
              <option value='Syndicate Bank - FD'>Syndicate Bank - FD</option>
              <option value='HDFC Diners Premium Cr Card'>HDFC Diners Premium Cr Card</option>
              <option value='SBI IRCTC Cr Card'>SBI IRCTC Cr Card</option>
              <option value='HDFC Diners Black Cr Card'>HDFC Diners Black Cr Card</option>
              <option value='Professional Fees Received'>Professional Fees Received</option>
              <option value='Professional Fees Paid'>Professional Fees Paid</option>
              <option value='Travel Expenses'>Travel Expenses</option>
              <option value='Staff Welfare'>Staff Welfare</option>
              <option value='Conveyance Expenses'>Conveyance Expenses</option>
              <option value='Communication Expenses'>Communication Expenses</option>
              <option value='Vehicle Maintenance'>Vehicle Maintenance</option>
              <option value='Life Insurance Premium'>Life Insurance Premium</option>
              <option value='Interest Received - SB'>Interest Received - SB</option>
              <option value='Interest Received - FD'>Interest Received - FD</option>
              <option value='Public Provident Fund'>Public Provident Fund</option>
              <option value='Drawings'>Drawings</option>
              <option value='TDS Deducted FY 2019 -20'>TDS Deducted FY 2019 -20</option>
              <option value='Mediclaim Insurance'>Mediclaim Insurance</option>
              <option value='Suspense'>Suspense</option>
            </select></td>
          <td>{data.drAmt}</td>
          <td>{data.crAmt}</td>
          <td>{data.amt}</td>
          <td>{data.narration}</td>
        </tr>
      )
    })

    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href>Voucher to tally XML </a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarColor03">
            <ul className="navbar-nav mr-auto">
            </ul>
          </div>
        </nav>
        <div className="container-fluid">
          <input type="file" id="chooseFile" ref="fileSelector"
            onChange={this.readInputFile.bind(this)} onClick={(event) => { event.target.value = null }} style={{ display: "none" }} />
          <div className="bg-info pl-2 pr-2 pb-1 pt-1 text-dark">
            Selected file :
            <button onClick={() => this.openFile()} type="button" className="btn btn-sm btn-primary">Open File</button> : {this.state.selectedFile}
            &nbsp;<button onClick={() => this.processCSV()} type="button" className="btn btn-sm btn-success">Process CSV</button>
            <button type="button" className="btn btn-sm btn-warning float-right" onClick={() => this.generateXML()}>Generate XML</button>
          </div>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Date</th>
                <th>Voucher Type</th>
                <th>Ref Number</th>
                <th>Dr Ledger</th>
                <th>Cr Ledger</th>
                <th>Dr Amount</th>
                <th>Cr Amounr</th>
                <th>Amount</th>
                <th>narration</th>
              </tr>
            </thead>
            <tbody>
              {tdata}
            </tbody>
          </table>
          <hr />
          <Results value={this.state.xml} show={this.state.showResult} toggle={() => this.toggleResult()} />
        </div>
      </div>
    )
  }
}
export default App;
