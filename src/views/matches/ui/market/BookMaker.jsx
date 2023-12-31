/* eslint-disable no-nested-ternary */
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from 'reactstrap';
import { io } from 'socket.io-client';
import { roundNumber, shortNumber } from '../../../../helper/number';
import { betTypes, setBetOdds } from '../../../../redux/reducers/event-bet';
import { setMarketRunnerPls } from '../../../../redux/reducers/event-market';
import useRunnerPl from '../../hooks/use-runner-pl';
import { setShouldLogin } from '../../../../redux/reducers/user-details';

const singleOdd = {
  back: [
    { price: 0, level: 0, class: '' },
    { price: 0, level: 1, class: '' },
    { price: 0, level: 2, class: '' },
  ],
  lay: [
    { price: 0, level: 0, class: '' },
    { price: 0, level: 1, class: '' },
    { price: 0, level: 2, class: '' },
  ],
  status: '',
};

const emptyOdds = {
  0: singleOdd,
  1: singleOdd,
};

const socketUrl = import.meta.env.VITE_SOCKET_URL;
const marketUrl = `${socketUrl}/market`;

function BookMaker({ market }) {
  const socket = useMemo(() => io(marketUrl, { autoConnect: false }), []);
  const userDetails = useSelector((state) => state.userDetails);
  const dispatch = useDispatch();
  const previousValue = useRef(emptyOdds);
  const { calculateRunnerPl } = useRunnerPl();

  const [loading, setLoading] = useState(true);
  const [runnerOdds, setRunnerOdds] = useState(emptyOdds);
  const [min, setMin] = useState(market.minStake);
  const [max, setMax] = useState(market.maxStake);

  const handleBookmakerData = (data) => {
    if (data) {
      const runners = data.matchOdds.reduce((acc, runner, index) => {
        const runnerBack =
          runner.back.length === 3
            ? runner.back
            : [
                ...runner.back,
                ...Array(3 - runner.back.length).fill(singleOdd),
              ];
        const runnerLay =
          runner.lay.length === 3
            ? runner.lay
            : [...runner.lay, ...Array(3 - runner.lay.length).fill(singleOdd)];

        const { back: previousBack, lay: previousLay } =
          previousValue?.current?.[index] || {};

        acc[index] = {
          ...runner,
          back: runnerBack.map((odd) => ({
            ...odd,
            class:
              odd.price > previousBack?.[odd.level]?.price
                ? 'odds-up'
                : odd.price < previousBack?.[odd.level]?.price
                ? 'odds-down'
                : '',
          })),
          lay: runnerLay.map((odd) => ({
            ...odd,
            class:
              odd.price > previousLay?.[odd.level]?.price
                ? 'odds-up'
                : odd.price < previousLay?.[odd.level]?.price
                ? 'odds-down'
                : '',
          })),
        };
        return acc;
      }, {});

      setMin(data.min);
      setMax(data.max);
      setRunnerOdds(runners);
      previousValue.current = runners;
    }
    setLoading(false);
  };

  useLayoutEffect(() => {
    socket.emit(
      'join:market',
      { id: market.apiMarketId, type: 'bookamkers' },
      handleBookmakerData,
    );
    socket.on(`market:data:${market.apiMarketId}`, handleBookmakerData);
    socket.connect();
    return () => {
      socket.off(`market:data:${market.apiMarketId}`);
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [market]);

  const handleOddClick = (runner, odd, type) => {
    const notLoggedIn =
      !userDetails?.user?._id || !localStorage.getItem('userToken');
    if (notLoggedIn) {
      dispatch(setShouldLogin(true));
      return;
    }
    if (odd.price === 0) return;
    const selectedOdd = {
      market: {
        _id: market._id,
        apiMarketId: market.apiMarketId,
        name: market.name,
        betDelay: 0,
        minStake: market.minStake,
        maxStake: market.maxStake,
        isBetLock: market.isBetLock || false,
      },
      runner: {
        _id: runner._id,
        selectionId: runner.selectionId,
        name: runner.name,
        priority: runner.priority,
        pl: runner.pl,
      },
      price: odd.price,
      betType: type,
    };
    dispatch(setBetOdds(selectedOdd));
    const runnerPls = calculateRunnerPl({
      odds: odd.price,
      market,
      runner,
      betType: type,
    });
    dispatch(setMarketRunnerPls({ marketId: market._id, runnerPls }));
  };

  return (
    <div className="pb-1">
      <div className="bet-table-row d-none-mobile">
        <div className="nation-name pe-2">
          <span className="max-bet">
            <span title={`Min:${shortNumber(min)}`}>
              Min:<span>{shortNumber(min)}</span>
            </span>
            <span className="ps-2" title={`Max:${shortNumber(max)}`}>
              Max:<span>{shortNumber(max)}</span>
            </span>
          </span>
        </div>

        <div className="back bl-title back-title">Back</div>
        <div className="lay bl-title lay-title">Lay</div>
      </div>

      {loading ? (
        <div className="col-md-12 text-center mt-2">
          <Spinner className="text-primary" />
        </div>
      ) : (
        market?.runners
          ?.map((runner) => {
            return (
              <div key={runner?.name}>
                <div className="bet-table-mobile-row d-none-lg">
                  <div className="bet-table-mobile-team-name">
                    <span>{runner?.name || ''}</span>
                    <div
                      className={`pt-1 small ${
                        runner?.pl > 0
                          ? 'text-success'
                          : runner?.pl < 0
                          ? 'text-danger'
                          : 'text-light'
                      }`}
                    >
                      {runner?.pl ? runner?.pl.toFixed(0) : ''}
                    </div>
                  </div>
                </div>

                <div
                  className={`bet-table-row ${
                    runnerOdds[runner?.priority]?.status === 'SUSPENDED'
                      ? 'suspendedtext'
                      : ''
                  } ${
                    runnerOdds[runner?.priority]?.status === 'Ball Running'
                      ? 'suspendedtext'
                      : ''
                  }`}
                  data-title={runnerOdds[runner?.priority]?.status}
                >
                  <div className="nation-name d-none-mobile">
                    <div className="w-100 d-flex justify-content-between align-items-center">
                      <div>
                        <span>{runner?.name || ''}</span>
                        <span className="float-right" />
                        <div
                          className={`pt-1 small ${
                            runner?.pl > 0
                              ? 'text-success'
                              : runner?.pl < 0
                              ? 'text-danger'
                              : 'text-light'
                          }`}
                        >
                          {runner?.pl ? runner.pl.toFixed(0) : ''}
                        </div>
                      </div>

                      {market?.runnerPls[runner._id]?.pl !== 0 ? (
                        <div
                          className={`small ${
                            market.runnerPls[runner._id]?.pl > 0
                              ? 'text-success'
                              : 'text-danger'
                          }`}
                        >
                          {roundNumber(market.runnerPls[runner._id]?.pl, 0)}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {runnerOdds[runner?.priority]?.back
                    ?.map((odd, i) => (
                      <button
                        type="button"
                        className={`bl-box back back${odd?.level || i} ${
                          odd?.class
                        }`}
                        key={`back-${odd?.level || i}`}
                        onClick={() =>
                          handleOddClick(runner, odd, betTypes.BACK)
                        }
                      >
                        {odd?.price && odd.price !== 0 ? (
                          <>
                            <span className="d-block odds">
                              {odd?.price
                                ? parseFloat(odd.price.toFixed(2))
                                : '-'}
                            </span>
                            <span className="d-block">
                              {odd?.size ? shortNumber(odd.size, 2) : 0}
                            </span>
                          </>
                        ) : (
                          <span>-</span>
                        )}
                      </button>
                    ))
                    .reverse()}

                  {runnerOdds[runner?.priority]?.lay?.map((odd, i) => (
                    <button
                      type="button"
                      className={`bl-box lay lay${odd?.level || i} ${
                        odd?.class
                      }`}
                      key={`lay-${odd?.level || i}`}
                      onClick={() => handleOddClick(runner, odd, betTypes.LAY)}
                    >
                      {odd?.price && odd.price !== 0 ? (
                        <>
                          <span className="d-block odds">
                            {odd?.price
                              ? parseFloat(odd.price.toFixed(2))
                              : '-'}
                          </span>
                          <span className="d-block">
                            {odd?.size ? shortNumber(odd.size, 2) : 0}
                          </span>
                        </>
                      ) : (
                        <span>-</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })
          ?.reverse()
      )}
    </div>
  );
}

export default BookMaker;
