import csv from 'csvtojson';
import { format } from 'libphonenumber-js';
// import { remover } from './acronym-remover';

const params = {
  colParser: {
    // sect: (item, head, resultRow, row, colIdx) => remover(item),
    // bran: (item, head, resultRow, row, colIdx) => remover(item),
    // grp: (item, head, resultRow, row, colIdx) => remover(item),
    // supervisor_position_title: (item, head, resultRow, row, colIdx) => remover(item),
    location_name: (item, head, resultRow, row, colIdx) => {
      const locations = {
        '1 Adelaide Terrace': '1 Adelaide Terrace, East Perth WA 6004',
        Baldivis: 'Baldivis WA 6171',
        Cannington: 'Mason Bird Building, 303 Sevenoaks Street, Cannington WA 6107',
        Carlisle: '37 Harris Street, Carlisle WA 6101',
        Geraldton: 'Post Office Plaza, 50-52 Durlacher Street, Geraldton WA 6530',
        'Mineral House - East Perth': 'Mineral House, 100 Plain Street, East Perth WA 6004',
        Perth: 'Gordon Stephenson House, 140 William Street, Perth WA 6000',
        'R-Albany': 'Unit 2/129 Aberdeen St, Albany WA 6330',
        'R-Broome': 'Woody\'s Arcade, 7/15 Dampier Terrace, Broome WA 6725',
        'R-Bunbury': 'Bunbury Tower, 61 Victoria Street, Bunbury WA 6230',
        'R-Collie': '66 Wittenoom St, Collie WA 6225',
        'R-Kalgoorlie': 'Suite 4/37 Brookman Street Kalgoorlie, WA 6430',
        'R-Karratha': 'The Quarter, 20 Sharpe Avenue, Karratha WA 6714',
        'R-Leonora': '13 Rochester Street, Leonora WA 6438',
        'R-Marble Bar': '31 General Street, Marble Bar WA 6760',
        'R-Meekatharra': '80 Savage Street, Meekatharra WA 6642',
        'R-Mount Magnet': 'Cnr Richardson and Hepburn Streets, Mount Magnet WA 6638',
        'R-Norseman': '89 Prinsep St, Norseman WA 6443',
        'R-Southern Cross': '75 Canopus Street, Southern Cross WA 6426',
      };

      return locations[item] ? locations[item] : '';
    },
    phone: (item, head, resultRow, row, colIdx) => format(item, 'AU', 'National'),
    mobile: (item, head, resultRow, row, colIdx) => format(item, 'AU', 'National'),
  },
};

const dmirs2json = (file) => {
  return new Promise((resolve, reject) => {
    csv(params).fromFile(file, (err, result) => {
      try {
        const filtered = result.filter((person) => {
          return !(person.actingOrHDAFlag === 'N' && !!person.HDA_termination_date);
        });
        resolve(filtered);
      } catch (error) {
        reject(error);
      }
    });
  });
};

// export default async function dmirs2jsonAa(file) {
//   await csv(params).fromFile(file, (err, result) => {
//     try {
//       const filtered = result.filter(person => !(person.actingOrHDAFlag === 'N' && !!person.HDA_termination_date));
//       return filtered;
//     } catch (error) {
//       console.error(error);
//       return error;
//     }
//   });
// }

export { dmirs2json };
