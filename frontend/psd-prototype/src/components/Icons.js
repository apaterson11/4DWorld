import L from 'leaflet';
import ArmyImage from '../markers/army.png';
import PinkArmyImage from '../markers/Pink_Army.png'
import GreenArmyImage from '../markers/Green_Army.png'
import BattleImage from '../markers/battle.png';
import CityImage from '../markers/city.png';
import DiseaseImage from '../markers/disease.png';
import FortressImage from '../markers/fortress.png';
import IndividualImage from '../markers/individual.png';
import IndustryImage from '../markers/industry.png';
import KnowledgeImage from '../markers/knowledge.png';
import ReligiousImage from '../markers/religious.png';
import TradingImage from '../markers/trading.png';
import VillageImage from '../markers/village.png';
import NodeImage from '../markers/node.png';



export const army = new L.Icon({
	iconUrl: ArmyImage,
	iconSize: [60, 98],
	iconAnchor: [30, 98],
	popupAnchor: [1, -34],
});

export const PinkArmy = new L.Icon({
	iconUrl: PinkArmyImage,
	iconSize: [60,98],
	iconAnchor: [30, 98],
	popupAnchor: [1, -34],
});

export const GreenArmy = new L.Icon({
	iconUrl: GreenArmyImage,
	iconSize: [60,98],
	iconAnchor: [30, 98],
	popupAnchor: [1, -34],
});

export const battle = new L.Icon({
	iconUrl: BattleImage,
	iconSize: [60, 98],
	iconAnchor: [30, 98],
	popupAnchor: [1, -34],
});


export const blueIcon = new L.Icon({
	iconUrl:
		'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
});

export const city = new L.Icon({
	iconUrl: CityImage,
	iconSize: [60, 98],
	iconAnchor: [30, 98],
	popupAnchor: [1, -34],
});

export const disease = new L.Icon({
	iconUrl: DiseaseImage,
	iconSize: [60, 98],
	iconAnchor: [30, 98],
	popupAnchor: [1, -34],
});

export const fortress = new L.Icon({
	iconUrl: FortressImage,
	iconSize: [60, 98],
	iconAnchor: [30, 98],
	popupAnchor: [1, -34],
});

export const individual = new L.Icon({
	iconUrl: IndividualImage,
	iconSize: [60, 98],
	iconAnchor: [30, 98],
	popupAnchor: [1, -34],
});

export const industry = new L.Icon({
	iconUrl: IndustryImage,
	iconSize: [60, 98],
	iconAnchor: [30, 98],
	popupAnchor: [1, -34],
});




export const knowledge = new L.Icon({
	iconUrl: KnowledgeImage,
	iconSize: [60, 98],
	iconAnchor: [30, 98],
	popupAnchor: [1, -34],
});


export const religious = new L.Icon({
	iconUrl: ReligiousImage,
	iconSize: [60, 98],
	iconAnchor: [30, 98],
	popupAnchor: [1, -34],
});

export const trading = new L.Icon({
	iconUrl: TradingImage,
	iconSize: [60, 98],
	iconAnchor: [30, 98],
	popupAnchor: [1, -34],
});

export const village = new L.Icon({
	iconUrl: VillageImage,
	iconSize: [60, 98],
	iconAnchor: [30, 98],
	popupAnchor: [1, -34],
});

export const node = new L.Icon({
	iconUrl: NodeImage,
	iconSize: [20, 20],
	iconAnchor: [10, 10],
	popupAnchor: [0, -8],
});


