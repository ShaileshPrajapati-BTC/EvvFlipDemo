import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk';
import {logger} from 'redux-logger';
import rootReducer from '../reducers/rootReducer'
import { persistStore, persistCombineReducers, autoRehydrate } from 'redux-persist'
import storage from 'redux-persist/es/storage' // defaults to localStorage for web and AsyncStorage for react-native

const config = {
  key: 'root',
  storage,
  blacklist: ['navigation']
}

const middleware = [
  thunkMiddleware,
  logger
];

const persistedReducer = persistCombineReducers(config, rootReducer)
const enhancers = [applyMiddleware(...middleware)];
const persistConfig = { enhancers };

const store = createStore(persistedReducer, undefined, compose(...enhancers));
const persistor = persistStore(store, persistConfig, () => {
    // console.log(store.getState());
});

const configureStore = () => {
    return { persistor, store };
}
export default configureStore;