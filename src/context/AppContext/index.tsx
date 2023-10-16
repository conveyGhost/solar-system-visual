import React from "react";
import * as Actions from "./action";
import { AppDate, today } from "../../domain/dates";
import { AppPlanet, PLANET_NAMES } from "../../domain/planets";
import { AppOptions } from "../../domain/options";

export type State = {
  date: AppDate;
  planets: AppPlanet[];
  options: AppOptions;
};

const initialize = (): State => ({
  date: today(),
  planets: PLANET_NAMES.map((name) => ({
    name,
    show: true,
  })),
  options: {
    planetNames: false,
  },
});

const reducer = (state: State, action: Actions.Action): State => {
  switch (action.tag) {
    case "UpdateDate": {
      return { ...state, date: action.date };
    }
    case "UpdateYear": {
      return { ...state, date: { ...state.date, year: action.year } };
    }
    case "GoToToday": {
      return {
        ...state,
        date: today(),
      };
    }
    case "SetPlanetShow": {
      const { name, show } = action;
      return {
        ...state,
        planets: state.planets.map((p) =>
          p.name === name
            ? {
                ...p,
                show,
              }
            : {
                ...p,
              },
        ),
      };
    }
    case "TogglePlanetNames": {
      return {
        ...state,
        options: { ...state.options, planetNames: !state.options.planetNames },
      };
    }
  }
};

export const AppStateContext = React.createContext<State | null>(null);

export type AppDispatcher = React.Dispatch<Actions.Action>;
export const AppDispatchContext = React.createContext<AppDispatcher | null>(
  null,
);

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [state, dispatch] = React.useReducer(reducer, initialize());

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};
