import './App.css';
import React, { useState } from 'react';
import SideNavBar from './components/SideNavBar/SideNavBar';
import TopBar from './components/TopBar/TopBar'
import Footer from './components/Footer/Footer';
import Page from './components/Pages/Page';
import { WebSocketProvider, UpdateValueWebSocketContext, ChangeValueWebSocketContext } from './WebSocket';
import { DataContext } from './DataContext';
// import Time from '../src/Scripts';

function App() {
  const [state, setState] = useState({ current_page: 'Master Index', data: {} });
  function setCurrentPage(page) {
    setState({ current_page: page });
  }
  return (
    <div className="App">
      <div className='allTabs'>
        <SideNavBar setCurrentPage={setCurrentPage}/>
      </div>
      <div className='App-Body'>
      <DataContext.Provider value={{ data: {} }}>
          <WebSocketProvider url="ws://192.168.102.128:3030/update_value_ws" context={UpdateValueWebSocketContext}>
            <WebSocketProvider url="ws://192.168.102.128:3030/change_value_ws" context={ChangeValueWebSocketContext}>
              <TopBar />
              <Page currentPage={state.current_page} />
            </WebSocketProvider>
          </WebSocketProvider>
        </DataContext.Provider>
      </div>
      <div className='App-Footer'>
        <Footer />
      </div>
    </div>
  );
}

export default App;
