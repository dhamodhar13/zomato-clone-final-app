import { BrowserRouter, Route} from 'react-router-dom';
import Home from './Home';
import Filter from './Filter';
import Details from './Details';
import User from './User';
import UpdatePassword from './UpdatePassword';

function Router() {
  return (
    <BrowserRouter>
      <Route exact path ='/' component={Home} />
      <Route path='/filter' component={Filter} />
      <Route path='/details' component={Details} />
      <Route path='/user' component={User} />
      <Route path='/update-password' component={UpdatePassword} />
    </BrowserRouter>
  )
}

export default Router;