import React from "react";

const ProviderSearchResult = ({
  result,
  onProfileClick,
  onLikeClick,
  showDistance,
  liked
}) => {
  return (
    <div className={"result py-2 row"} onClick={e => onProfileClick(result, e)}>
      <div className="col-4">
        <strong className="d-block">
          <a
            href={"/provider-profile/" + result.id_provider}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#212529" }}
          >
            {result.doctor_name && (
              <React.Fragment>Dr. {result.doctor_name}</React.Fragment>
            )}
            {!result.doctor_name && (
              <React.Fragment>{result.name}</React.Fragment>
            )}
          </a>
        </strong>
        <small>{result.specialty_type}</small>
        <span className="phone-number">
          <i className="fas fa-phone mr-2" />
          {result.phone_number}
        </span>
      </div>
      <div className="col-5">
        <span className="d-block"> {result.address_street1}</span>
        <small>
          {result.address_street2 && (
            <React.Fragment>
              {result.address_street2}
              <br />
            </React.Fragment>
          )}
          {result.address_city}, {result.address_state} {result.address_zipcode}
        </small>
        <br />
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`http://maps.google.com/maps?saddr=Current+Location&daddr=${
            result.lat
          },${result.lng}&ie=UTF-8&view=map&t=m&z=16`}
          className="btn btn-directions btn-sm px-3 py-0 btn-primary mt-1"
        >
          <small className="font-weight-bold">Get Directions</small>
        </a>
      </div>
      <div className="col-3">
        <span className="d-block">
          {showDistance && result.distance_miles
            ? `${result.distance_miles.toFixed(2)} miles`
            : ""}
        </span>
        <div
          className="btn btn-directions btn-sm px-3 py-0 btn-primary mt-1"
          style={{
            display: "inline-block"
          }}
          onClick={() => (liked() ? null : onLikeClick())}
        >
          <small className="font-weight-bold">
            {liked() ? (
              <i className="fas fa-check mr-1" />
            ) : (
              <i className="fas fa-thumbs-up mr-1" />
            )}{" "}
            {result.likes}
          </small>
        </div>
      </div>
    </div>
  );
};

export default ProviderSearchResult;
