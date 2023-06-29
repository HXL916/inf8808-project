# Débatoscope 📚💬

Débatoscope is a website built with Angular 16 and D3 that allows users to visualize interventions at the House of Commons of Canada. The website is structured under three tabs, each serving a specific purpose. Let's take a closer look:

## Tabs Structure

### 🏠 Tab 1: Accueil

The first tab acts as a landing screen, focusing on the number of interventions by each party, some key stats, intervention type distribution, and a top-flop of the MPs that spoke the most in the House since September 2021.

### 🪑 Tab 2:Composition de la chambre

This tab allows users to view the MPs that have been elected in the house during a given legislature, and view them with three key metrics: gender, political party and province.
Please do note that since some MPs have left their seat during a legislature and been replaced by a byelection, the number of MPs during a legislature can be higher than 338.

### 📊 Tab 3: Distribution des débats

In this tab, users can explore a bar chart visualization of the interventions based on the selected date range. The visualizations are created using D3, a powerful data visualization library. Users can interact with the chart to gain insights and understand patterns in the interventions. They can view them by three key metrics; gender, political party and province, and can toggle specific intervention types on or off.
For the date range picker, the user can select from existing preselected ranges, or can set their own range manually through an interactive calendar or through the text field (format: AAAA-MM-JJ)

## To run Débatoscope on your local machine, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd project-inf8808`
3. Install the dependencies: `npm install`
4. Start the development server: `ng serve`
5. Open your web browser and visit: `http://localhost:4200`

Make sure you have Node.js and Angular CLI installed on your machine before proceeding with the above steps.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## License 📑

Débatoscope uses the following MIT License-protected toolsets: [Angular](https://angular.io/license), [Angular Material](https://github.com/angular/components/blob/main/LICENSE), [DefinitelyTyped(d3)](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/LICENSE).

Débatoscope is also available under [MIT License](https://github.com/HXL916/inf8808-project/blob/master/LICENSE).

Enjoy exploring and visualizing interventions with Débatoscope! 🎉💡
