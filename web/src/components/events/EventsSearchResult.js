import React from "react";
import { Link } from "react-router-dom";

const EventsSearchResult = ({ event }) => {
  return (
    <React.Fragment>
      <div className="col-md-4 mb-3">
        <div className="card bg-white shadow">
          <a href={event.link} className="card-title">
            {event.name}
          </a>
          <Link
            to={"/category/" + event.id_event_category}
            className="card-subtitle"
          >
            {event.category}
          </Link>
          <p className="card-desc">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
            commodo ligula eget dolor. Aenean massa. Cum sociis natoque
            penatibus et magnis dis parturient montes, nascetur ridiculus mus.
            Donec quam felis, ultricies nec, pellentesque eu, pretium.
          </p>
        </div>
      </div>
    </React.Fragment>
  );
};

export default EventsSearchResult;
