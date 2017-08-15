var THREE = require('three');

// VARIABLES

export const allCubes = () => ({
  '0': [], '1': [], '2': [], '3': [],
  '4': [], '5': [], '6': [], '7': [],
  '8': [], '9': [], '10': [], '11': [],
  '12': [], '13': [], '14': [], '15': [],
  '16': [], '17': [], '18': [], '19': [],
  '20': [], '21': [], '22': [], '23': [],
  '24': []
});

export const stillShapes = () => ({
  '-5': [-1],
  '-4': [-1],
  '-3': [-1],
  '-2': [-1],
  '-1': [-1],
  '0': [-1],
  '1': [-1],
  '2': [-1],
  '3': [-1],
  '4': [-1],
  '5': [-1],
  '6': [-1]
});


export let score = 0;


// ACTIONS

// export const level = lvl => {
//   switch (lvl.toString()) {
//
//     case '0':
//     levelStatus = 1;
//     return 0.05;
//     break;
//
//     case '1':
//     levelStatus = 2;
//     return 0.08;
//     break;
//
//     case '2':
//     levelStatus = 3;
//     return 0.1;
//     break;
//
//     case '3':
//     levelStatus = 4;
//     return 0.12;
//     break;
//
//     case '4':
//     levelStatus = 5;
//     return 0.15;
//     break;
//
//     case '5':
//     levelStatus = 6;
//     return 0.18
//     break;
//
//     default:
//     levelStatus = 7;
//     return 0.2;
//   }
//
// }

export const levelSpeed = {
  1: 0.05, 2: 0.08, 3: 0.1, 4: 0.12, 5: 0.15, 6: 0.18, 7: 0.2
}
