import React, { Component } from 'react';
import axios from 'axios';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CalendarToolbar from './CalendarToolbar';

const localizer = BigCalendar.momentLocalizer(moment);

class Calendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: []
    };

    this.getEvents = this.getEvents.bind(this);
    this.selectEvent = this.selectEvent.bind(this);
    this.toolbarChange = this.toolbarChange.bind(this);
  }

  componentDidMount() {
    const dateFrom = moment()
      .startOf('month')
      .format('YYYY-MM-DD');

    const dateTo = moment()
      .endOf('month')
      .format('YYYY-MM-DD');

    this.getEvents(dateFrom, dateTo);
  }

  toolbarChange(dateFrom, dateTo, idEventCategory) {
    this.getEvents(dateFrom, dateTo, idEventCategory);
  }

  getEvents(dateFrom, dateTo, idEventCategory) {
    axios
      .get(
        '/api/v1/events?date_from=' +
          dateFrom +
          '&date_to=' +
          dateTo +
          (idEventCategory ? '&id_event_category=' + idEventCategory : '')
      )
      .then(result => {
        this.setState({ events: result.data.results });
      });
  }

  selectEvent(event) {
    window.open(event.link + '/search?q=' + event.name, '_blank');
  }

  render() {
    return (
      <React.Fragment>
        <div className="event-calendar-hero">
          <div style={{ backgroundColor: 'rgba(0, 0, 0, .75)' }}>
            <div className="container h-100 align-middle text-light py-3">
              <h4 className="d-block m-0 px-0 py-5 font-weight-normal text-center">
                The most comprehensive list of local health related events in
                Miami&minus;Dade County.
              </h4>
            </div>
          </div>
        </div>
        <div className="bg-sand">
          <div className="container py-4 px-3">
            <div className="px-3 mb-0">
              <div className="py-5 text-center">
                <CalendarToolbar onChange={this.toolbarChange} />
                <BigCalendar
                  style={{ height: 1000, width: '100%' }}
                  toolbar={false}
                  localizer={localizer}
                  events={this.state.events}
                  date={this.state.date}
                  onNavigate={() => {}}
                  titleAccessor="name"
                  startAccessor="date_from"
                  endAccessor="date_to"
                  onSelectEvent={event => this.selectEvent(event)}
                />
              </div>
              <div className="p-4 bg-tan-dark-tint rounded text-center">
                If you have an event you’d like to post, please email us at
                events@choicemd.com
                <br />
                We are completely local and offer <strong>
                  FREE listings
                </strong>{' '}
                for all non-profit organizations.
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}


export default Calendar;

