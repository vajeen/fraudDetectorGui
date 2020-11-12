import React from "react";
import axios from 'axios';
import * as moment from 'moment';
import { Helmet } from 'react-helmet';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import { formatDate, parseDate } from 'react-day-picker/moment';

import {
    Form,
    FormGroup,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Col
} from "reactstrap";

import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

const today = new Date();
var lastmonth = new Date();
lastmonth.setDate(0);
const df = 'From: ' + moment(today).format('MMM') + ' ' + today.getDate() + ', ' + today.getFullYear();
const dt = 'To: ' + moment(today).format('MMM') + ' ' + today.getDate() + ', ' + today.getFullYear();

class Reporting extends React.Component {
    constructor(props) {
        super(props);
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
        this.onClickDR = this.onClickDR.bind(this);
        this.onClickHour = this.onClickHour.bind(this);
        this.handleDayChange = this.handleDayChange.bind(this);
        this.dropDown = this.dropDown.bind(this);
        this.buttonDis = this.buttonDis.bind(this);
        this.state = {
            from: undefined,
            to: undefined,
            btn1dis: true,
            btn2dis: true,
            selectedDay: undefined,
            hour: null
        };
    }

    onClickDR() {
        axios({
            url: 'http://172.19.6.232:4000/api/download_dr',
            method: 'POST',
            responseType: 'blob',
            data: { from: this.state.from, to: this.state.to }
        })
            .then((response) => {
                if (response.status === 204) {
                    alert("No Data");
                } else {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    let fileName = 'unknown';
                    console.log("dispo");
                    const contentDisposition = response.headers['content-disposition'];
                    console.log(contentDisposition)
                    if (contentDisposition) {
                        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
                        if (fileNameMatch.length === 2)
                            fileName = fileNameMatch[1];
                    }
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                }
            });
    }

    onClickHour() {
        axios({
            url: 'http://172.19.6.232:4000/api/download_hour',
            method: 'POST',
            responseType: 'blob',
            data: { date: this.state.selectedDay, hour: this.state.hour }
        })
            .then((response) => {
                if (response.status === 204) {
                    alert("No Data");
                } else {
                    console.log(response.headers)
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    let fileName = 'unknown';
                    console.log("dispo");
                    const contentDisposition = response.headers['content-disposition'];
                    console.log(contentDisposition)
                    if (contentDisposition) {
                        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
                        if (fileNameMatch.length === 2)
                            fileName = fileNameMatch[1];
                    }
                    console.log(fileName);
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                }
            });
    }

    showFromMonth() {
        const { from, to } = this.state;
        if (!from) {
            return;
        }
        if (moment(to).diff(moment(from), 'months') < 2) {
            this.to.getDayPicker().showMonth(from);
        }
        this.buttonDis()
    }

    buttonDis() {
        console.log("to");
        console.log(this.state.to);
        console.log("from");
        console.log(this.state.from);
        console.log("selectday")
        console.log(this.state.selectedDay)
        console.log("hour")
        console.log(this.state.hour)
        if (this.state.from && this.state.to) {
            this.setState({ btn1dis: false })
        } else {
            this.setState({ btn1dis: true })
        }

        if (this.state.selectedDay && this.state.hour) {
            this.setState({ btn2dis: false })
        } else {
            this.setState({ btn2dis: true })
        }
    }

    handleFromChange(from) {
        // Change the from date and focus the "to" input field
        this.setState({ from }, this.buttonDis);
    }

    handleToChange(to) {
        this.setState({ to }, this.showFromMonth);
    }

    handleDayChange(day) {
        this.setState({ selectedDay: day }, this.buttonDis);
    }

    dropDown(option) {
        console.log("dropdown")
        console.log(option.label)
        this.setState({ hour: option.label }, this.buttonDis)
    }

    render() {
        const { from, to } = this.state;
        const modifiers = { start: from, end: to };
        const { selectedDay } = this.state;
        const options = [
            '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'
        ]
        return (
            <>
                <div className="content">
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CardHeader>
                                    <Row>
                                        <CardHeader>
                                            <CardTitle tag="h4">Generate Report - Date Range</CardTitle>
                                        </CardHeader>
                                    </Row>
                                    <Row>
                                        <Col className="text-left" sm="6">
                                            <h5 className="card-category">Date Range</h5>
                                        </Col>
                                        <Col sm="6">

                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <Form>
                                        <Row>
                                            <Col className="pr-md-1" md="10">
                                                <FormGroup>
                                                    <div style={{ paddingTop: '10px' }}>
                                                        <DayPickerInput
                                                            value={from}
                                                            placeholder={df}
                                                            format="LL"
                                                            formatDate={formatDate}
                                                            parseDate={parseDate}
                                                            dayPickerProps={{
                                                                month: lastmonth,
                                                                selectedDays: [from, { from, to }],
                                                                disabledDays: { after: today },
                                                                toMonth: to,
                                                                modifiers,
                                                                numberOfMonths: 2,
                                                                onDayClick: () => this.to.getInput().focus(),
                                                            }}
                                                            onDayChange={this.handleFromChange}
                                                        />{' '}—{' '}
                                                        <span className="InputFromTo-to">
                                                            <DayPickerInput
                                                                ref={el => (this.to = el)}
                                                                value={to}
                                                                placeholder={dt}
                                                                format="LL"
                                                                formatDate={formatDate}
                                                                parseDate={parseDate}
                                                                dayPickerProps={{
                                                                    selectedDays: [from, { from, to }],
                                                                    disabledDays: { before: from, after: today },
                                                                    modifiers,
                                                                    month: from,
                                                                    fromMonth: from,
                                                                    numberOfMonths: 2,
                                                                }}
                                                                onDayChange={this.handleToChange}
                                                            />
                                                        </span>
                                                        <Helmet>
                                                            <style>{`
                                                            .InputFromTo .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
                                                                background-color: #f0f8ff !important;
                                                                color: #4a90e2;
                                                            }
                                                            .InputFromTo .DayPicker-Day {
                                                                border-radius: 0 !important;
                                                            }
                                                            .InputFromTo .DayPicker-Day--start {
                                                                border-top-left-radius: 50% !important;
                                                                border-bottom-left-radius: 50% !important;
                                                            }
                                                            .InputFromTo .DayPicker-Day--end {
                                                                border-top-right-radius: 50% !important;
                                                                border-bottom-right-radius: 50% !important;
                                                            }
                                                            .InputFromTo .DayPickerInput-Overlay {
                                                                width: 550px;
                                                            }
                                                            .InputFromTo-to .DayPickerInput-Overlay {
                                                                margin-left: -198px;
                                                            }
                                                            `}</style>
                                                        </Helmet>
                                                    </div>
                                                </FormGroup>
                                            </Col>
                                            <Col>
                                                <div style={{ float: 'right' }}>
                                                    <button disabled={this.state.btn1dis} onClick={this.onClickDR} type="button" class="btn btn-default">Go</button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12">
                            <Card>
                                <CardHeader>
                                    <CardTitle tag="h4">Generate Report - Hourly</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col md="3">
                                            <div style={{ paddingTop: '5px' }}>
                                                <div>
                                                    {selectedDay && <p>Day: {selectedDay.toLocaleDateString()}</p>}
                                                    {!selectedDay && <p>Choose a day</p>}
                                                    <DayPickerInput onDayChange={this.handleDayChange} /></div>
                                            </div>
                                        </Col>
                                        <Col md="2">
                                            <div style={{ paddingTop: '23px' }}>
                                                <Col><Dropdown options={options} onChange={this.dropDown} value={this.state.hour} placeholder="Select hour" /></Col>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div style={{ float: 'right', paddingTop: '18px' }}>
                                                <button disabled={this.state.btn2dis} onClick={this.onClickHour} type="button" class="btn btn-default">Go</button>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                </div>
            </>
        );
    }
}

export default Reporting;
