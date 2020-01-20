import axios from 'axios'
import { boundMethod } from 'autobind-decorator'

const GOOGLE_API_KEY = 'AIzaSyBgIQtMG7gHXflnXdqG5NcjktnbGsY7NzI'

type ResponseGoogleMapsAPI = {
  results: google.maps.GeocoderResult[];
  status: google.maps.GeocoderStatus | google.maps.GeocoderStatus.ZERO_RESULTS 
}

export default class MapApp {
  
  form: HTMLFormElement;
  addressInput: HTMLInputElement;

  constructor() {
    this.form = document.querySelector('form')!
    this.addressInput = <HTMLInputElement>document.getElementById('address')
    this.configure();
  }
  
  configure() {
    this.form.addEventListener('submit', this.searchAddressHandler)
  }

  @boundMethod
  searchAddressHandler(event: Event) {
    event.preventDefault()
    
    this.addressInput.disabled = true

    let address = this.addressInput.value;
    
    axios
      .get<ResponseGoogleMapsAPI>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(address)}&key=${GOOGLE_API_KEY}`)
      .then(response => {
        if (response.data.status != google.maps.GeocoderStatus.OK) {
          throw new Error(response.data.status);
        }
        this.renderMap(response.data.results[0].geometry.location)
      })
      .finally(() => {
        this.addressInput.disabled = false
      })
  }

  renderMap(coordinates: google.maps.LatLng) {
    let map = new google.maps.Map(document.getElementById('map')!, {
      center: coordinates,
      zoom: 8
    });

    new google.maps.Marker({position: coordinates, map: map});    
  }
}
