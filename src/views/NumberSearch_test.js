import React from "react";
import axios from 'axios'
import {
    Input,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Table,
    Row,
    Col
} from "reactstrap";

class NumberTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tbody: null,
            mobile: null,
            regexp: /^[0-9\b]+$/,
            disabled: true,
            tabledata: [],
            tabledis: false,
            tablemsg: "Please search your mobile number"
        };
        this.onClick = this.onClick.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.renderTableData = this.renderTableData.bind(this);
    }

    renderTableData() {
        return this.state.tabledata.map((tablerow, index) => {
            const { DAY, HOUR, MO_CALL_B_NUMBER_UNIQUE,  } = tablerow //destructuring
            return (
                <tr key={DAY}>
                    <td>{DAY}</td>
                    <td>{HOUR}</td>
                    <td>{MO_CALL_B_NUMBER_UNIQUE}</td>
                </tr>
            )
        })
    }

    changeHandler = (e) => {
        let val = e.target.value;
        if (val === '' || this.state.regexp.test(val)) {
            this.setState({ mobile: val })
            if ((val.length === 9) && (val.charAt(0) === '7')) {
                this.setState({ disabled: false })
            } else if ((val.length === 10) && (val.charAt(0) === '0') && (val.charAt(1) === '7')) {
                this.setState({ disabled: false })
            } else {
                this.setState({ disabled: true })
            }
        }
    }

    onClick() {
        axios.post('http://172.19.6.232:4000/api/mobilesearch', { mobile: this.state.mobile })
            .then((data) => {
                var tmpdata = data.data
                var tmptbody
                var tmptb = []
                var tlen = Object.keys(data.data.data).length
                console.log(tlen)
                var tdis = false
                var tmsg = null
                Object.keys(tmpdata.data).forEach(function (key) {
                    console.log(tmpdata.data[key])
                    tmptb.push({ DAY: tmpdata.data[key]['DAY'], HOUR: tmpdata.data[key]['HOUR'], MO_CALL_B_NUMBER_UNIQUE: tmpdata.data[key]['MO_SMS_B_NUMBER_UNIQUE'] })
                });
                if (tlen > 0) {
                    tdis = true
                    tmsg = null
                } else {
                    tdis = false
                    tmsg = "No Data"
                }
                this.setState({
                    tbody: tmptbody,
                    tabledata: tmptb,
                    tabledis: tdis,
                    tablemsg: tmsg
                }, function () { this.renderTableData() });
                console.log("tablerow now")
                console.log(this.state.tabledata)
            })
            .catch(error => {
                console.log("ERRRRRRRRRRRRRRR")
                console.log(error)
            })
    }
    render() {
        return (
            <>
                <div className="content">
                    <Row>
                        <Col md="12">
                            <Card>
                                <CardHeader>
                                    <CardTitle tag="h4">Search</CardTitle>
                                </CardHeader>
                                <CardBody>


                                    <label>Mobile Number</label>
                                    <Row>
                                        <Col md="4">
                                            <div style={{ paddingTop: '5px' }}>
                                                <Input
                                                    defaultValue=""
                                                    placeholder="071xxxxxxx"
                                                    type="text"
                                                    pattern="[0-9]*"
                                                    value={this.state.mobile || ''}
                                                    onChange={this.changeHandler}
                                                />
                                            </div>
                                        </Col>
                                        <Col>
                                            <button disabled={this.state.disabled} onClick={this.onClick} type="button" class="btn btn-default">Go</button>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12">
                            <Card md="12" style={{ overflowX: 'scroll' }}>
                                <CardHeader>
                                    <CardTitle tag="h4">Data</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    {this.state.tabledis && (
                                        <Table className="tablesorter table-bordered">

                                                <tr>
                                                    <th>Date</th>
                                                    <th>Hour</th>
                                                    <th>Number of Calls</th>
                                                </tr>

                                            <tbody>
                                                {this.renderTableData()}
                                            </tbody>
                                        </Table>
                                    )}
                                    <div>
                                        {this.state.tablemsg}
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default NumberTest;