import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import filter from 'lodash/filter';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import isUndefined from 'lodash/isUndefined';
import uniqBy from 'lodash/uniqBy';
import analyticsIcon from './images/analytics-icon.svg';
import logo from './images/property-pulse-logo.svg';
import settingsIcon from './images/settings-icon.svg';
import './App.css';

const DATASETS = {
  Yes: {
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
  No: {
    label: 'My First dataset',
    fill: false,
    lineTension: 0.1,
    backgroundColor: 'rgba(192,75,75,0.4)',
    borderColor: 'rgba(192,75,75,1)',
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBorderColor: 'rgba(192,75,75,1)',
    pointBackgroundColor: '#fff',
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: 'rgba(192,75,75,1)',
    pointHoverBorderColor: 'rgba(220,220,220,1)',
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
    data: [65, 59, 80, 81, 56, 55, 40],
  },
};

class App extends Component {
  state = {
    data: {},
    responses: [],
    questions: [],
    activeQuestion: '5d0a5990163c280840f20eb8',
  };

  async componentDidMount() {
    const responses = await this.getResponses();
    const questions = uniqBy(responses.data, response => response.question._id).map(
      response => response.question
    );

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

    const newData = { labels: this.getLabels(), datasets: this.getDatasets() };
    this.setState({ data: newData });
  };

  getDatasets = () => {
    const activeQuestion = find(this.state.questions, { _id: this.state.activeQuestion });
    const keyedResponses = groupBy(this.state.responses, response =>
      format(parse(response.createdAt), 'MMM DD')
    );
    let datasets = [];
    let data = {};
    Object.keys(keyedResponses).forEach(key => {
      activeQuestion.responses.forEach(response => {
        if (isUndefined(data[response.text])) {
          data[response.text] = [];
        }
        const responseCount = filter(
          keyedResponses[key],
          answer => answer.response._id === response._id
        ).length;

        data[response.text] = [...data[response.text], responseCount];
      });
    });

    Object.keys(data).forEach(responseText =>
      datasets.push({ ...DATASETS[responseText], data: data[responseText], label: responseText })
    );
    return datasets;
  };

  getLabels = () => {
    const keyedResponses = groupBy(this.state.responses, response =>
      format(parse(response.createdAt), 'MMM DD')
    );
    return Object.keys(keyedResponses);
  };

  getResponses = async () => {
    const responses = await axios.post(
      'http://localhost:3000/responses',
      { days: 20 },
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
