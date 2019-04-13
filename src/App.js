import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import './App.css';


const particlesOptions = {
  particles: {
    number: {
      value: 300,
      density: {
        enable: true,
        value_area: 1000
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name:'',
    email:'',
    entries: 0,
    joined:''
  }
}


class App extends Component {
  constructor() {
    super();
    this.state = initialState;
    }

//will update the state of the received user
  loadUser = (data) => {
    this.setState({user:{
      id: data.id,
      name:data.name,
      email:data.email,
      entries: data.entries,
      joined:data.joined
    }})
  }


  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box})
  }

  onInputChange = (event) => {
    //set state for updating component state
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
       fetch(fetch('https://face-detectorapi.herokuapp.com/imageurl',{
        method: 'post' ,
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify({
          input:this.state.input
        })
  
        }))
        .then(response => response.json())
       .then(response => {
         if (response) {
           fetch('https://face-detectorapi.herokuapp.com/image',{
            method: 'put' ,
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({
              email:this.state.user.id
            })
      
           })
           .then(response => response.json())
           .then(count =>{
             //when the above excuted the count must be updated here
             //using object.assign to affect only the entries cause normal way effect all to undefined
                  this.setState(Object.assign(this.state.user,{ entries:count }))
           })
           .catch(console.log)
         }
       })
       //because we use classes
       .then(response => this.displayFaceBox(this.calculateFaceLocation(response))
       .catch(err => console.log(err))
       //here we will receive responses
      
  );
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }
  

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn}onRouteChange={this.onRouteChange}/>
        { this.state.route ==='home' 
        ?
         <div>
        <Logo />
        <Rank name={this.state.user.name} entries={this.state.user.entries}/> 
        <ImageLinkForm 
        onInputChange={this.onInputChange} 
        onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition box={box} imageUrl={imageUrl}/>
        </div>
        : (
          route === 'signin' 
          ? <Signin  onRouteChange={this.onRouteChange}/>
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        )
        
        }
      </div>
    );
  }
}

export default App;
