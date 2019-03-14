import React from 'react';

const ProviderSearchResult = ({ result, onProfileClick, showDistance }) => {
  return (
    <tr>
      <td className="pl-3" style={{ width: '300px' }}>
        {/* <i className="fas fa-star star-gold mr-2" /> */}
        <a
          className="text-body font-weight-bold"
          style={{ fontSize: '1.25rem' }}
        >
          {result.doctor_name && (
            <React.Fragment>
              Dr.{' '}
              {result.doctor_name}
            </React.Fragment>
          )}
          {!result.doctor_name && (
            <React.Fragment>{result.name}</React.Fragment>
          )}
        </a>
        <br />
        <small className="text-muted">{result.specialty_type}</small>
      </td>
      <td>
        <strong>{result.name}</strong>
        <br />
        {result.address_street1}
        <br />
        {result.address_street2 && (
          <React.Fragment>
            {result.address_street2}
            <br />
          </React.Fragment>
        )}
        {result.address_city}, {result.address_state} {result.address_zipcode}
      </td>
      <td className="align-middle" style={{ width: '120px' }}>
        {showDistance ? `${result.distance_miles.toFixed(2)} miles` : ''}
      </td>
      <td className="align-middle pr-3" style={{ width: '155px' }}>
        <button onClick={() => onProfileClick(result)} className="btn btn-pill btn-violet pl-3">
          View Profile
          <i className="fas fa-chevron-circle-right ml-2" />
        </button>
      </td>
    </tr>
  );
};

export default ProviderSearchResult;
