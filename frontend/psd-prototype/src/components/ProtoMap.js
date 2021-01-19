import React from 'react'
import {Map, Popup, TileLayer, Marker} from 'react-leaflet'

class ProtoMap extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            fetched: false
        }
    }

    componentDidMount() {
        const url = 'http://127.0.0.1:8000/api/landmarks.json'
        fetch(url).then(response => response.json())
                  .then(r => this.setState({landmarks: r, fetched: true}))
    }

    render() {
        const {fetched, landmarks} = this.state 
        let content = ''
        if (fetched) {
            content = landmarks.map((landmark, index) =>
                <Marker key={index} position={[landmark.latitude, landmark.longitude]}>
                    <Popup>
                        {landmark.description}
                    </Popup>
                </Marker>)
        }
        return (
            <Map center={[this.props.latitude, this.props.longitude]} zoom={12} maxBounds={[[90,-180],[-90, 180]]}>
                <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    minZoom = {1}
                    maxZoom = {18}
                    noWrap={true}
                />
                {content}
            </Map>
        )
    }
}

export default ProtoMap