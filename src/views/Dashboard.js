import React from "react";
// react plugin used to create charts
import { Line } from "react-chartjs-2";

import axios from 'axios';
import * as moment from 'moment';
import { Helmet } from 'react-helmet';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import { formatDate, parseDate } from 'react-day-picker/moment';

// reactstrap components
import {
    Form,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    FormGroup,
    Row,
    Col
} from "reactstrap";

const today = new Date();
var lastmonth = new Date();
lastmonth.setDate(0);
const df = 'From: ' + moment(today).format('MMM') + ' ' + today.getDate() + ', ' + today.getFullYear();
const dt = 'To: ' + moment(today).format('MMM') + ' ' + today.getDate() + ', ' + today.getFullYear();
var chart_options = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  tooltips: {
    backgroundColor: "#f5f5f5",
    titleFontColor: "#333",
    bodyFontColor: "#666",
    bodySpacing: 4,
    xPadding: 12,
    mode: "nearest",
    intersect: 0,
    position: "nearest"
  },
  responsive: true,
  scales: {
    yAxes: [
      {
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: "rgba(29,140,248,0.0)",
          zeroLineColor: "transparent"
        },
        ticks: {
          suggestedMin: 60,
          suggestedMax: 125,
          padding: 20,
          fontColor: "#9a9a9a"
        }
      }
    ],
    xAxes: [
      {
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: "rgba(29,140,248,0.1)",
          zeroLineColor: "transparent"
        },
        ticks: {
          padding: 20,
          fontColor: "#9a9a9a"
        }
      }
    ]
  }
};
class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bigChartData: "data1",
            s1: null, s2: null, lab: null
        };
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.state = {
            from: undefined,
            to: undefined,
        };
    }

    showFromMonth() {
        const { from, to } = this.state;
        if (!from) {
            return;
        }
        if (moment(to).diff(moment(from), 'months') < 2) {
            this.to.getDayPicker().showMonth(from);
        }
    }

    handleFromChange(from) {
        // Change the from date and focus the "to" input field
        this.setState({ from });
        console.log("from");
        console.log(from);
    }

    handleToChange(to) {
        this.setState({ to }, this.showFromMonth);
        console.log("to");
        console.log(to);
    }

    onClick() {
        console.log("clicked");
        console.log(this.state.from);
        console.log(this.state.to);
        if (this.state.from && this.state.to) {
            console.log("all right");
            axios.post('http://172.19.6.232:4000/api/summarydate', { params: { from: this.state.from, to: this.state.to } })
                .then((data) => {
                    var tmpdata = data.data
                    var tmps1 = []
                    var tmps2 = []
                    var tmplab = []
                    console.log("####################")
                    console.log(data)
                    console.log(Object.keys(data.data.data).length)
                    this.setState({ datalen: Object.keys(data.data.data).length })
                    Object.keys(tmpdata.data).forEach(function (key) {
                        console.log(tmpdata.data[key])
                        Object.keys(tmpdata.data[key]).forEach(function (key2) {
                            if (key2 === "DD") {
                                tmplab.push(tmpdata.data[key][key2])
                            } else if (key2 === "FRAUD") {
                                tmps1.push(tmpdata.data[key][key2])
                            } else if (key2 === "TOTAL") {
                                tmps2.push(tmpdata.data[key][key2])
                            }
                        });
                    });
                    //console.log(chart_hight2)
                    this.setState({
                        s1: tmps1,
                        s2: tmps2,
                        lab: tmplab
                    });
                })
                .catch(error => {
                    console.log("ERRRRRRRRRRRRRRR")
                    console.log(error)
                })
        }
    }

    datas1 = canvas => {
        let ctx = canvas.getContext("2d");

        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(255, 0, 0, 0.4)");
        gradientStroke.addColorStop(0.4, "rgba(255, 0, 0, 0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

        return {
            labels: this.state.lab,
            datasets: [
                {
                    label: "Fraud",
                    fill: true,
                    backgroundColor: gradientStroke,
                    borderColor: "red",
                    borderWidth: 2,
                    borderDash: [],
                    borderDashOffset: 0.0,
                    pointBackgroundColor: "red",
                    pointBorderColor: "rgba(255,255,255,0)",
                    pointHoverBackgroundColor: "#1f8ef1",
                    pointBorderWidth: 20,
                    pointHoverRadius: 4,
                    pointHoverBorderWidth: 15,
                    pointRadius: 4,
                    data: this.state.s1
                }
            ]
        };
    }

    datas2 = canvas => {
        let ctx = canvas.getContext("2d");

        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

        return {
            labels: this.state.lab,
            datasets: [
                {
                    label: "Total",
                    fill: true,
                    backgroundColor: gradientStroke,
                    borderColor: "#1f8ef1",
                    borderWidth: 2,
                    borderDash: [],
                    borderDashOffset: 0.0,
                    pointBackgroundColor: "#1f8ef1",
                    pointBorderColor: "rgba(255,255,255,0)",
                    pointHoverBackgroundColor: "#1f8ef1",
                    pointBorderWidth: 20,
                    pointHoverRadius: 4,
                    pointHoverBorderWidth: 15,
                    pointRadius: 4,
                    data: this.state.s2
                }
            ]
        };
    };

    setBgChartData = name => {
        this.setState({
            bigChartData: name
        });
    };


    componentDidMount() {
        this.getSummary()
    }

    getSummary() {
        axios.get('http://172.19.6.232:4000/api/summary')
            .then((data) => {
                var tmpdata = data.data
                var tmps1 = []
                var tmps2 = []
                var tmplab = []
                console.log("####################")
                console.log(data)
                console.log(Object.keys(data.data.data).length)
                this.setState({ datalen: Object.keys(data.data.data).length })
                Object.keys(tmpdata.data).forEach(function (key) {
                    console.log(tmpdata.data[key])
                    Object.keys(tmpdata.data[key]).forEach(function (key2) {
                        if (key2 === "DD") {
                            tmplab.push(tmpdata.data[key][key2])
                        } else if (key2 === "FRAUD") {
                            tmps1.push(tmpdata.data[key][key2])
                        } else if (key2 === "TOTAL") {
                            tmps2.push(tmpdata.data[key][key2])
                        }
                    });
                });
                //console.log(chart_hight2)
                this.setState({
                    s1: tmps1,
                    s2: tmps2,
                    lab: tmplab
                });
            })
            .catch(error => {
                console.log("ERRRRRRRRRRRRRRR")
                console.log(error)
            })
    }


    render() {
        const { from, to } = this.state;
        const modifiers = { start: from, end: to };
        return (
            <>
                <div className="content">
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CardHeader>
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
                                                    <button onClick={this.onClick} type="button" class="btn btn-default">Go</button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CardHeader>
                                    <Row>
                                        <Col className="text-left" sm="6">
                                            <h5 className="card-category">Stats</h5>
                                            <CardTitle tag="h2">Fraud</CardTitle>
                                        </Col>
                                        <Col sm="6">

                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <div className="chart-area" style={{ height: '300px' }}>
                                        <Line
                                            data={this.datas1}
                                            options={chart_options}
                                        />
                                    </div>
                                    <CardTitle tag="h2">Normal</CardTitle>
                                    <div className="chart-area" style={{ height: '300px' }}>
                                        <Line
                                            data={this.datas2}
                                            options={chart_options}
                                        />
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

export default Dashboard;
