# Sweat-Today Web App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub last commit](https://img.shields.io/github/last-commit/mttam/Sweat-Today)](https://github.com/mttam/Sweat-Today/commits/main)
[![GitHub issues](https://img.shields.io/github/issues/mttam/Sweat-Today)](https://github.com/mttam/Sweat-Today/issues)


## Overview

Sweat-Today is a web application designed to help users track and manage their workout schedules and exercises. It's built using HTML, CSS, and JavaScript, with a focus on simplicity and ease of use.

## Key Features

- Add, modify, and delete exercises
- Organize exercises into presets
- Save and load presets
- Import/Export functionality for exercises and presets
- Responsive design for mobile and desktop use

## User Interface

- Clean, modern design with a blue and orange color scheme
- Intuitive input fields for adding exercises
- Visual indicators for completed exercises
- Dialog boxes for preset management and import/export

## Functionality

- Add new exercises with details (series, repetitions, weight)
- Modify existing exercises
- Delete individual exercises or entire workout schedules
- Create and manage presets for common workout routines
- Import and export data in JSON format

## Technical Details

- Built using HTML5, CSS3, and vanilla JavaScript
- Implements custom dialog boxes for user interactions
- Utilizes local storage for data persistence
- Responsive design using CSS media queries


## Data Format import/export
The ID with value N represents the exercises available locally, while those with their own ID are the presets
'''json
{"preset": [
    {
      "id": "Test",
      "esercizi": [
        "Serie(4)-Rep(15)-Peso(50)-Chest press"
      ]
    },
    {
      "id": "N",
      "esercizi": [
        "GRANDE GIOVE",
        "Serie(4)-Rep(12)-Peso(50)-Leg Press",
        "Serie(4)-Rep(15)-Peso(25)-Leg Extension"
      ]
    }
  ]
}


## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/mttam/Sweat-Today.git
   ```

2. Open the `index.html` file in your preferred web browser.

## Live Demo
try the web app at the following link: [Sweat-Today](https://sweat-today.netlify.app/) 

## Contributing

Contributions are welcome! Please submit a pull request with your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [mttam](https://github.com/mttam) - Creator and maintainer

## Contact

For any questions or feedback, please contact [mttam](https://github.com/mttam) or visit the [project's GitHub page](https://github.com/mttam/Sweat-Today).

[![GitHub followers](https://img.shields.io/github/followers/mttam?style=social)](https://github.com/mttam)
[![Twitter Follow](https://img.shields.io/twitter/follow/mttam?style=social)](https://twitter.com/mttam)

---
