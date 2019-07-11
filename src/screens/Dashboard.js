import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import filter from 'lodash/filter';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import isUndefined from 'lodash/isUndefined';
import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';
import { withAuth } from '../context/auth';
import { getResponses } from '../utils/quiz-client';
import analyticsIcon from '../images/analytics-icon.svg';
import logo from '../images/property-pulse-logo.svg';
import settingsIcon from '../images/settings-icon.svg';
import './Dashboard.css';

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

class Dashboard extends Component {
  state = {
    data: {},
    responses: [],
    questions: [],
    activeQuestion: '5d0a5990163c280840f20eb8',
  };

  async componentDidMount() {
    const responses = await this.getResponses();
    const questions = uniqBy(responses, response => response.question._id).map(
      response => response.question
    );

    this.setState({ responses: sortBy(responses, ['createdAt']), questions });
    this.setGraphDataForQuestion();
  }

  handleQuestionChange = e => {
    // Run filtering and set graph data based on new question
    const activeQuestion = e.target.value;
    this.setState({ activeQuestion }, () => this.setGraphDataForQuestion());
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
    const { activeQuestion, questions } = this.state;
    const currentQuestion = questions.length ? find(questions, { _id: activeQuestion }) : {};
    const responses = this.getResponsesForActiveQuestion();
    const keyedResponses = groupBy(responses, response =>
      format(parse(response.createdAt), 'MMM DD')
    );
    let datasets = [];
    let data = {};
    Object.keys(keyedResponses).forEach(key => {
      currentQuestion.responses.forEach(response => {
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
    const responses = this.getResponsesForActiveQuestion();
    const keyedResponses = groupBy(responses, response =>
      format(parse(response.createdAt), 'MMM DD')
    );
    return Object.keys(keyedResponses);
  };

  getResponsesForActiveQuestion = () =>
    filter(this.state.responses, response => response.question._id === this.state.activeQuestion);

  getResponses = async () => {
    const responses = await getResponses({ days: 20 });

    return responses;
  };

  render() {
    const { activeQuestion, questions } = this.state;
    const currentQuestion = questions.length ? find(questions, { _id: activeQuestion }) : {};
    const { logout } = this.props.auth;

    return (
      <div className="app">
        <header className="header">
          <div className="header__inner">
            <img className="logo" src={logo} alt="Property Pulse" />
            <button className="button button__hollow" onClick={logout}>
              Sign out
            </button>
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
            <h3>{currentQuestion.text}</h3>
            <select onChange={e => this.handleQuestionChange(e)}>
              {questions.map(question => (
                <option value={question._id}>{question.text}</option>
              ))}
            </select>
            <Line data={this.state.data} />
          </div>
        </div>
      </div>
    );
  }
}

export default withAuth(Dashboard);
