/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import '../../../matches/ui/page-content/matches.css';
import moment from 'moment';
import menuImages from '../../../../components/common/exchange-sidemenu/menu-images';

function EventList({ events, sportName }) {
  const imgPath = menuImages[sportName] || '';
  return (
    <div className="comman-bg mb-0">
      <div className="bet-table-header d-flex sport4 d-none-mobile">
        <div className="game-title justify-content-start">
          <img src={imgPath} alt={sportName} />
          <span className="ms-1">{sportName || ''}</span>
        </div>
        <div className="point-title">1</div>
        <div className="point-title">X</div>
        <div className="point-title">2</div>
      </div>
      <div className="bet-table-body">
        {events?.length ? (
          events?.map((event, i) => (
            <div className="bet-table-box" key={i}>
              <div className="bet-table-row p-2">
                <div className="game-title d-none-mobil">
                  <div className="game-date">
                    <p className="day text-left">
                      {event?.matchDate
                        ? moment(event?.matchDate).isSame(moment(), 'day')
                          ? 'Today'
                          : moment(event?.matchDate).isSame(
                              moment().clone().add(1, 'day'),
                              'day',
                            )
                          ? 'Tomorrow'
                          : moment(event?.matchDate).format()
                        : ''}
                    </p>
                    <p className="mb-0 day text-left">
                      {event?.matchDate
                        ? moment(event?.matchDate).format('HH:mm')
                        : ''}
                    </p>
                  </div>
                  <div className="game-name d-inline-block">
                    <a className="text-decoration-none" href="/">
                      <p className="team-name text-left">
                        {event?.eventName || ''}
                      </p>
                      <p className="team-name text-left team-event">
                        ({event?.competitionName || ''})
                      </p>
                    </a>
                  </div>
                  <div className="game-icons">
                    <div className="game-icon">
                      <span className="f-bm-icon">F1</span>
                    </div>
                    <div className="game-icon">
                      <span className="f-bm-icon">F</span>
                    </div>
                  </div>
                </div>
                <div className="point-title">
                  <div className="back bl-box event-box">
                    <span className="d-block odds">1.79</span>
                  </div>
                  <div className="lay bl-box event-box">
                    <span className="d-block odds">1.82</span>
                  </div>
                </div>
                <div className="point-title">
                  <div className="no-val bl-box event-box">
                    <span className="d-block odds">—</span>
                  </div>
                  <div className="no-val bl-box event-box">
                    <span className="d-block odds">—</span>
                  </div>
                </div>
                <div className="point-title">
                  <div className="back bl-box event-box">
                    <span className="d-block odds">2.22</span>
                  </div>
                  <div className="lay bl-box event-box">
                    <span className="d-block odds">2.28</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-3 text-center">NO DATA</div>
        )}
      </div>
    </div>
  );
}

export default EventList;
