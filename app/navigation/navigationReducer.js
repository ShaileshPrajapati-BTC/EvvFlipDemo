import Navigation from "./navigationStack";

const initialState = Navigation.router.getStateForAction(
  Navigation.router.getActionForPathAndParams("Splash")
);

const navigationReducer = (state = initialState, action) => {
  const newState = Navigation.router.getStateForAction(action, state);
  return newState || state;
};

export default navigationReducer;
