export interface Stop {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface Route {
  id: string;
  name: string;
  color: string;
  stops: Stop[];
  description: string;
}

export const stops: Record<string, Stop> = {
  // Common stops
  guingona: { id: 'guingona', name: 'Guingona Park', lat: 8.947864, lng: 125.543641 },
  sm: { id: 'sm', name: 'SM Butuan', lat: 8.946717, lng: 125.534085 },
  robinsons: { id: 'robinsons', name: 'Robinsons Mall Butuan', lat: 8.943086, lng: 125.519684 },
  libertad: { id: 'libertad', name: 'Libertad Public Market', lat: 8.944367, lng: 125.503229 },
  bancasi: { id: 'bancasi', name: 'Bancasi Rotunda', lat: 8.946388, lng: 125.479413 },
  cityHall: { id: 'cityHall', name: 'Butuan City Hall', lat: 8.954719, lng: 125.528630 },
  langihan: { id: 'langihan', name: 'Langihan Public Market', lat: 8.958245, lng: 125.533843 },
  csu: { id: 'csu', name: 'Caraga State University', lat: 8.959626, lng: 125.596357 },
  capitol: { id: 'capitol', name: 'Provincial Capitol', lat: 8.941327, lng: 125.533499 },

  // R1 stops
  duranoSt: { id: 'duranoSt', name: 'Durano St.', lat: 8.943366, lng: 125.540538 },
  jollibeeDowntown: { id: 'jollibeeDowntown', name: 'Jollibee Downtown', lat: 8.947953, lng: 125.540272 },
  hotelOazis: { id: 'hotelOazis', name: 'Hotel Oazis', lat: 8.944286, lng: 125.526697 },
  lmxConvention: { id: 'lmxConvention', name: 'LMX Convention', lat: 8.942390, lng: 125.491561 },

  // R2 stops
  centralElem: { id: 'centralElem', name: 'Butuan Central Elem. School', lat: 8.945790, lng: 125.543434 },
  riverPark: { id: 'riverPark', name: 'Butuan River Park', lat: 8.950003, lng: 125.543804 },
  postOffice: { id: 'postOffice', name: 'Post Office', lat: 8.951774, lng: 125.542619 },
  northMontilla: { id: 'northMontilla', name: 'North Montilla Boulevard', lat: 8.951745, lng: 125.540960 },
  hapiEnterprise: { id: 'hapiEnterprise', name: 'Hapi Enterprise', lat: 8.961055, lng: 125.535569 },
  taboan: { id: 'taboan', name: 'Taboan', lat: 8.960089, lng: 125.534125 },
  holyRedeemer: { id: 'holyRedeemer', name: 'Holy Redeemer Church', lat: 8.958362, lng: 125.529192 },
  doongan: { id: 'doongan', name: 'Doongan Crossing', lat: 8.958479, lng: 125.527252 },
  waterDistrict: { id: 'waterDistrict', name: 'Butuan Water District', lat: 8.947928, lng: 125.530966 },

  // R3 stops
  suzuki: { id: 'suzuki', name: 'Suzuki Butuan', lat: 8.952943, lng: 125.558640 },
  baanKm3: { id: 'baanKm3', name: 'Baan KM3', lat: 8.955397, lng: 125.572125 },
  tiniwisan: { id: 'tiniwisan', name: 'Tiniwisan Crossing', lat: 8.957007, lng: 125.582108 },
  ampayon: { id: 'ampayon', name: 'Ampayon Triangle', lat: 8.961703, lng: 125.602815 },

  // R4 stops
  mcaloSt: { id: 'mcaloSt', name: 'M. Calo St.', lat: 8.945985, lng: 125.544197 },
  ltfrb: { id: 'ltfrb', name: 'LTFRB Caraga', lat: 8.956788, lng: 125.611881 },
  antongalon: { id: 'antongalon', name: 'Antongalon Diversion', lat: 8.953818, lng: 125.616561 },
  taligaman: { id: 'taligaman', name: 'Taligaman', lat: 8.940753, lng: 125.628956 },
  deOro: { id: 'deOro', name: 'De Oro', lat: 8.926694, lng: 125.641965 },
  fsuu: { id: 'fsuu', name: 'Father Saturnino Urios University', lat: 8.947847, lng: 125.541450 },
  sjit: { id: 'sjit', name: 'Saint Joseph Institute Technology', lat: 8.951637, lng: 125.541764 },
  northMontilla2: { id: 'northMontilla2', name: 'North Montilla Boulevard', lat: 8.957886, lng: 125.539603 },

  // R5 stops
  stoNino: { id: 'stoNino', name: 'Sto. Niño', lat: 9.028474, lng: 125.599469 },
  losAngeles: { id: 'losAngeles', name: 'Los Angeles', lat: 9.014186, lng: 125.606316 },
  sumilihon: { id: 'sumilihon', name: 'Sumilihon', lat: 8.991444, lng: 125.613135 },
  lumina: { id: 'lumina', name: 'Lumina Homes', lat: 8.977090, lng: 125.605040 },
  langihanTerminal: { id: 'langihanTerminal', name: 'Langihan Bus Terminal', lat: 8.959330, lng: 125.535496 },

  // R6 stops
  guingona2: { id: 'guingona2', name: 'T. Guingona', lat: 8.943233, lng: 125.537169 },
  pizarro: { id: 'pizarro', name: 'Pizarro St.', lat: 8.943635, lng: 125.538597 },
  southMontilla: { id: 'southMontilla', name: 'South Montilla Boulevard', lat: 8.939178, lng: 125.539524 },
  rosewood: { id: 'rosewood', name: 'Rosewood', lat: 8.925529, lng: 125.539677 },
  villaKananga: { id: 'villaKananga', name: 'Villa Kananga Diversion', lat: 8.922242, lng: 125.540957 },
  mahay: { id: 'mahay', name: 'Mahay', lat: 8.923456, lng: 125.558108 },
  lemon: { id: 'lemon', name: 'Lemon', lat: 8.945125, lng: 125.584246 },
  pigdaulan: { id: 'pigdaulan', name: 'Pigdaulan', lat: 8.932256, lng: 125.586500 },
  lowerTagabaca: { id: 'lowerTagabaca', name: 'Lower Tagabaca', lat: 8.911465, lng: 125.583807 },
  bilay: { id: 'bilay', name: 'Bilay', lat: 8.849312, lng: 125.576896 },
  maguinda: { id: 'maguinda', name: 'Maguinda', lat: 8.820526, lng: 125.588531 },

  // R7 stops
  obrero: { id: 'obrero', name: 'Obrero', lat: 8.962200, lng: 125.537968 },
  sanVicente: { id: 'sanVicente', name: 'San Vicente', lat: 8.907076, lng: 125.546693 },
  bitos: { id: 'bitos', name: 'Bit-os', lat: 8.894124, lng: 125.545434 },
  amparo: { id: 'amparo', name: 'Amparo', lat: 8.865805, lng: 125.556816 },
  bitanagan: { id: 'bitanagan', name: 'Bitanagan Crossing', lat: 8.858496, lng: 125.554805 },
  dulag: { id: 'dulag', name: 'Dulag', lat: 8.825803, lng: 125.534606 },
  tungao: { id: 'tungao', name: 'Tungao', lat: 8.778339, lng: 125.567745 }
};

export const routes: Route[] = [
  {
    id: 'R1',
    name: 'North Montilla - City Proper Loop',
    color: '#1e40af',
    description: 'SM Butuan, Robinsons, Bancasi',
    stops: [
      stops.guingona,
      stops.duranoSt,
      stops.jollibeeDowntown,
      stops.sm,
      stops.hotelOazis,
      stops.robinsons,
      stops.libertad,
      stops.lmxConvention,
      stops.bancasi
    ]
  },
  {
    id: 'R2',
    name: 'JAQNO - Crossing Dumalagan',
    color: '#dc2626',
    description: 'Langihan, City Hall, Robinsons',
    stops: [
      stops.guingona,
      stops.centralElem,
      stops.riverPark,
      stops.postOffice,
      stops.northMontilla,
      stops.hapiEnterprise,
      stops.taboan,
      stops.langihan,
      stops.holyRedeemer,
      stops.doongan,
      stops.cityHall,
      stops.waterDistrict,
      stops.hotelOazis,
      stops.robinsons,
      stops.libertad,
      stops.lmxConvention,
      stops.bancasi
    ]
  },
  {
    id: 'R3',
    name: 'Ampayon - Libertad',
    color: '#16a34a',
    description: 'CSU, SM Butuan, Libertad Market',
    stops: [
      stops.libertad,
      stops.robinsons,
      stops.hotelOazis,
      stops.sm,
      stops.jollibeeDowntown,
      stops.guingona,
      stops.suzuki,
      stops.baanKm3,
      stops.tiniwisan,
      stops.csu,
      stops.ampayon
    ]
  },
  {
    id: 'R4',
    name: 'De Oro',
    color: '#ec4899',
    description: 'Langihan, SM Butuan, Ampayon, De Oro',
    stops: [
      stops.taboan,
      stops.langihan,
      stops.cityHall,
      stops.waterDistrict,
      stops.sm,
      stops.jollibeeDowntown,
      stops.duranoSt,
      stops.mcaloSt,
      stops.suzuki,
      stops.baanKm3,
      stops.tiniwisan,
      stops.csu,
      stops.ampayon,
      stops.ltfrb,
      stops.antongalon,
      stops.taligaman,
      stops.deOro,
      stops.fsuu,
      stops.sjit,
      stops.northMontilla2,
      stops.hapiEnterprise
    ]
  },
  {
    id: 'R5',
    name: 'Santo Niño',
    color: '#f97316',
    description: 'Sumilihon, CSU, Langihan, City Hall',
    stops: [
      stops.stoNino,
      stops.losAngeles,
      stops.sumilihon,
      stops.lumina,
      stops.ampayon,
      stops.csu,
      stops.tiniwisan,
      stops.baanKm3,
      stops.suzuki,
      stops.jollibeeDowntown,
      stops.sm,
      stops.waterDistrict,
      stops.cityHall,
      stops.langihan,
      stops.langihanTerminal,
      stops.northMontilla2,
      stops.jollibeeDowntown
    ]
  },
  {
    id: 'R6',
    name: 'Maguinda',
    color: '#eab308',
    description: 'Capitol, South Montilla, Maguinda',
    stops: [
      stops.capitol,
      stops.guingona2,
      stops.pizarro,
      stops.southMontilla,
      stops.rosewood,
      stops.villaKananga,
      stops.mahay,
      stops.lemon,
      stops.pigdaulan,
      stops.lowerTagabaca,
      stops.bilay,
      stops.maguinda
    ]
  },
  {
    id: 'R7',
    name: 'Tungao',
    color: '#84cc16',
    description: 'Capitol, San Vicente, Tungao',
    stops: [
      stops.capitol,
      stops.waterDistrict,
      stops.cityHall,
      stops.holyRedeemer,
      stops.hapiEnterprise,
      stops.obrero,
      stops.northMontilla,
      stops.jollibeeDowntown,
      stops.southMontilla,
      stops.villaKananga,
      stops.sanVicente,
      stops.bitos,
      stops.amparo,
      stops.bitanagan,
      stops.dulag,
      stops.tungao
    ]
  }
];

export const popularDestinations = [
  { name: 'SM Butuan', stopId: 'sm', icon: '🛍️' },
  { name: 'Robinsons Mall', stopId: 'robinsons', icon: '🏬' },
  { name: 'CSU', stopId: 'csu', icon: '🎓' },
  { name: 'City Hall', stopId: 'cityHall', icon: '🏛️' },
  { name: 'Guingona Park', stopId: 'guingona', icon: '🌳' },
  { name: 'Bancasi', stopId: 'bancasi', icon: '✈️' }
];
