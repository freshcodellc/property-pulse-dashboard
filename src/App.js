import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';
import analyticsIcon from './images/analytics-icon.svg';
import logo from './images/property-pulse-logo.svg';
import settingsIcon from './images/settings-icon.svg';
import './App.css';

const DATA = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40],
    },
  ],
};

class App extends Component {
  state = {
    data: {},
    responses: [],
    questions: [],
  };

  async componentDidMount() {
    const responses = await this.getResponses();
    const questions = uniqBy(responses.data, response => response.question._id).map(
      response => response.question
    );
    console.log('Q', questions);
    this.setState({ responses: responses.data, questions });
    this.setGraphDataForQuestion();
  }

  handleQuestionChange = () => {
    // Run filtering and set graph data based on new question
  };

  handleRangeChange = () => {
    // Hit API to get new response data for a given range
  };

  setGraphDataForQuestion = () => {
    // Given a new question calculate the new graph data
    let datasets = [...DATA.datasets];
    let labels = [];
    let data = [];
    const keyedResponses = groupBy(
      this.state.responses,
      response =>
        console.log('DATE', parse(response.createdAt)) ||
        format(parse(response.createdAt), 'MMM DD')
    );
    Object.keys(keyedResponses).map(key => {
      labels.push(key);
      data.push(keyedResponses[key].length);
    });

    datasets[0].data = data;
    datasets[0].label = this.state.responses[0].question.text;
    const newData = { ...DATA, labels, datasets };
    this.setState({ data: newData });
  };

  getResponses = async () => {
    const responses = await axios.post(
      'http://localhost:3000/responses',
      { days: 10 },
      {
        headers: {
          Authorization:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMGE1NDY4MDc3NzQ5MDdiYWJlZjkxYSIsImlhdCI6MTU2MTQ0MTE5Nn0._yy60MQgfh7j9LLsTBJrH_GoCDGUPOMIIV7hA1kwcNk',
        },
      }
    );
    return responses;
  };

  render() {
    return (
      <div className="app">
        <header className="header">
          <div className="header__inner">
            <img className="logo" src={logo} alt="Property Pulse" />
            <button className="button button__hollow">Sign out</button>
          </div>
        </header>
        <div className="main">
          <div className="menu">
            <div className="menu__item">
              <img className="menu__item-icon" src={analyticsIcon} alt="Analytics Icon" />
              Analytics
            </div>
            <div className="menu__item">
              <img className="menu__item-icon" src={settingsIcon} alt="Settings Icon" />
              Settings
            </div>
          </div>
          <div className="content">
            <Line data={this.state.data} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
