import { createSlice, current } from '@reduxjs/toolkit';

export const eventMarketSlice = createSlice({
  name: 'eventMarket',

  initialState: {
    /**
     * {
     *    eventId: String,
     *    name: String,
     *    competitionName: String,
     *    startsOn: DateTime,
     *    videoStreamId: String | null,
     * }
     */
    event: {},

    /**
     * [
     *    {
     *      _id: String,
     *      apiMarketId: String,
     *      eventId: String,
     *      name: String,
     *      eventName: String,
     *      plForecast: [Number],
     *      runnerPls: {},
     *      minStake: Number,
     *      maxStake: Number,
     *      betDelay: Number, // in seconds
     *      isBetLock: Boolean,
     *      runners: [
     *        {
     *          _id: String,
     *          pl: Number,
     *          selectionId: Number,
     *          name: String,
     *          back: [{ price: Number, size: Number, level: Number }],
     *          lay: [{ price: Number, size: Number, level: Number }],
     *        },
     *        ...
     *      ]
     *    },
     *    ...
     * ]
     */
    markets: [],
    allEvents: [],
  },

  reducers: {
    setEvent: (state, action) => {
      state.event = action.payload;
    },

    setMarkets: (state, action) => {
      state.markets = action.payload;
    },

    setMarketPlForecast: (state, action) => {
      const { marketId, plForecast } = action.payload;
      state.markets = state.markets.map((mkt) => {
        if (mkt._id === marketId) {
          return { ...mkt, plForecast };
        }
        return mkt;
      });
    },

    setMarketRunnerPls: (state, action) => {
      const { marketId, runnerPls } = action.payload;
      state.markets = state.markets.map((mkt) => {
        if (mkt._id === marketId) {
          return { ...mkt, runnerPls };
        }
        return mkt;
      });
    },

    setMarketRunnerPl: (state, action) => {
      const runnerPls = action.payload;

      runnerPls.forEach((runnerPl) => {
        const { marketId, _id, pl } = runnerPl;
        const currentMarkets = current(state).markets;

        state.markets = currentMarkets.map((mkt) => {
          if (mkt._id === marketId) {
            const runners = mkt.runners.map((runner) => {
              if (runner._id === _id) {
                return { ...runner, pl };
              }
              return runner;
            });
            return { ...mkt, runners };
          }
          return mkt;
        });
      });
    },

    clearOtherMarketForecasts: (state, action) => {
      const marketId = action.payload;
      const currentMarkets = current(state).markets;
      state.markets = currentMarkets.map((mkt) => {
        if (mkt._id !== marketId) {
          return { ...mkt, runnerPls: {} };
        }
        return mkt;
      });
    },
    setAllEvents: (state, action) => {
      state.allEvents = action.payload;
    },

    setEventFavourite: (state, action) => {
      const { sportsId, eventId } = action.payload;
      state.allEvents = state.allEvents.map((sports) => {
        if (sports._id === sportsId) {
          const events = sports.events.map((evnt) => {
            if (evnt._id === eventId) {
              return { ...evnt, favourite: !evnt.favourite };
            }
            return evnt;
          });
          return { ...sports, events };
        }
        return sports;
      });
    },

    resetEventMarket: (state) => {
      state.event = {};
      state.markets = [];
    },
  },
});

export const {
  setEvent,
  setMarkets,
  setMarketPlForecast,
  setMarketRunnerPls,
  clearOtherMarketForecasts,
  resetEventMarket,
  setMarketRunnerPl,
  setAllEvents,
  setEventFavourite,
} = eventMarketSlice.actions;

export default eventMarketSlice.reducer;
