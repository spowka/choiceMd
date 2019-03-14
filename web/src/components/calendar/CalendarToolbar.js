import React from 'react';
import axios from 'axios';
import Toolbar from 'react-big-calendar/lib/Toolbar';
import moment from 'moment';

export default class CalendarToolbar extends Toolbar {
  constructor(self) {
    super(self);

    this.state = {
      date: new Date(),
      dateFrom: moment()
        .startOf('month')
        .format('YYYY-MM-DD'),
      dateTo: moment()
        .endOf('month')
        .format('YYYY-MM-DD'),
      categories: [],
      categoriesParent: [],
      categoriesChild: [],
      categoryParentId: '',
      categoryChildId: '',
      idEventCategory: '',
      isChildCategorySelectDisabled: true,
      monthName: moment().format('MMMM')
    };

    this.navigate = this.navigate.bind(this);
    this.categoryParentChange = this.categoryParentChange.bind(this);
    this.categoryChildChange = this.categoryChildChange.bind(this);
  }

  componentDidMount() {
    axios.get('/api/v1/events/categories').then(result => {
      this.setState({
        categories: result.data,
        categoriesParent: result.data.filter(
          i => i.id_event_category_parent == null
        )
      });
    });
  }

  navigateChange(action) {
    var dateCurrent = this.state.date;

    if (action === 'PREV') {
      dateCurrent = moment(this.state.date)
        .add(-1, 'months')
        .toDate();
    }
    if (action === 'NEXT') {
      dateCurrent = moment(this.state.date)
        .add(1, 'months')
        .toDate();
    }
    if (action === 'TODAY') {
      dateCurrent = new Date();
    }

    const dateFrom = moment(dateCurrent)
      .startOf('month')
      .format('YYYY-MM-DD');
    const dateTo = moment(dateCurrent)
      .endOf('month')
      .format('YYYY-MM-DD');

    this.setState({
      date: dateCurrent,
      dateFrom: dateFrom,
      dateTo: dateTo,
      monthName: moment(dateCurrent).format('MMMM')
    });

    this.props.onChange(dateFrom, dateTo, this.state.idEventCategory);
  }

  categoryParentChange(event) {
    let categoryParentId = parseInt(event.target.value, 10);
    let idEventCategory = null;
    let isChildCategorySelectDisabled = false;
    let categoriesChild = [];

    if (categoryParentId === -1) {
      idEventCategory = null;
      isChildCategorySelectDisabled = true;
    } else {
      idEventCategory = categoryParentId;

      categoriesChild = this.state.categories.filter(
        i => i.id_event_category_parent === categoryParentId
      );
      isChildCategorySelectDisabled =
        categoriesChild.length === 0 ? true : false;
    }

    this.setState({
      categoryParentId: categoryParentId,
      idEventCategory: idEventCategory,
      isChildCategorySelectDisabled: isChildCategorySelectDisabled,
      categoriesChild: categoriesChild
    });

    this.props.onChange(
      this.state.dateFrom,
      this.state.dateTo,
      idEventCategory
    );
  }

  categoryChildChange(event) {
    let categoryChildId = parseInt(event.target.value, 10);
    let idEventCategory = null;

    if (categoryChildId === -1) {
      idEventCategory = this.state.categoryParentId;
    } else {
      idEventCategory = categoryChildId;
    }

    this.setState({
      categoryChildId: categoryChildId,
      idEventCategory: idEventCategory
    });

    this.props.onChange(
      this.state.dateFrom,
      this.state.dateTo,
      idEventCategory
    );
  }

  render() {
    return (
      <div className="row mt-2 mb-2">
        <div className="col-sm-4">
          <div className="row pt-3">
            <div className="col-sm-6">
              <select
                className="custom-select mb-2 mb-sm-0"
                onChange={this.categoryParentChange}
                value={this.state.categoryParentId}
              >
                <option placeholder="true" hidden>
                  All Categories
                </option>
                <option value="-1">All Categories</option>
                {this.state.categoriesParent.map(option => (
                  <option
                    value={option.id_event_category}
                    key={option.id_event_category}
                  >
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-sm-6">
              <select
                className="custom-select mb-sm-0"
                onChange={this.categoryChildChange}
                value={this.state.categoryChildId}
                {...this.state.isChildCategorySelectDisabled === true && {
                  disabled: 'disabled'
                }}
              >
                <option placeholder="true" hidden>
                  Subcategory
                </option>
                <option value="-1">Any</option>
                {this.state.categoriesChild.map(option => (
                  <option
                    value={option.id_event_category}
                    key={option.id_event_category}
                  >
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="col-sm-4 pt-4">
          <strong>{this.state.monthName}</strong>
        </div>
        <div className="col-sm-4">
          <div className="rbc-btn-group">
            <button
              type="button"
              onClick={() => this.navigateChange('PREV')}
              className="btn btn-pill btn-hero btn-violet pl-4 mt-2"
            >
              PREV
            </button>
            <button
              type="button"
              onClick={() => this.navigateChange('TODAY')}
              className="btn btn-pill btn-hero btn-violet pl-4 mt-2"
            >
              TODAY
            </button>
            <button
              type="button"
              onClick={() => this.navigateChange('NEXT')}
              className="btn btn-pill btn-hero btn-violet pl-4 mt-2"
            >
              NEXT
            </button>
          </div>
        </div>
      </div>
    );
  }
}
