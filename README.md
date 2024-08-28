# ngx-number-ticker

`@omnedia/ngx-number-ticker` is an Angular library that provides a smooth animated number ticker. The component allows you to animate the counting of a number from its current state to a target value with customizable animation duration. This is perfect for dynamically displaying changing values such as counters, stats, or any number-based data in your Angular application.

## Features

- Smooth number ticker animation, counting up or down to a target value.
- Customizable animation duration.
- Easy to integrate as a standalone component.

## Installation

Install the library using npm:

```bash
npm install @omnedia/ngx-number-ticker
```

## Usage

Import the `NgxNumberTickerComponent` in your Angular module or component:

```typescript
import { NgxNumberTickerComponent } from '@omnedia/ngx-number-ticker';

@Component({
  ...
  imports: [
    ...
    NgxNumberTickerComponent,
  ],
  ...
})
```

Use the component in your template:

```html
<om-number-ticker
  [countTo]="1000"
  [countDuration]="2000"
  styleClass="custom-ticker-class"
></om-number-ticker>
```

## API

```html
<om-number-ticker
  [countTo]="countTo"
  [countDuration]="countDuration"
  [transformFunction]="transformFunction"
  styleClass="your-custom-class"
></om-number-ticker>
```

- `countTo` (required): The target number to which the ticker will count up or down.
- `countDuration` (optional): The duration of the counting animation in milliseconds. Defaults to 2000ms.
- `transformFunction` (optional): Callback-Function to modify the displayed number. E.g. formatting it to toLocaleString()
- `styleClass` (optional): A custom CSS class to apply to the number ticker for additional styling.

## Example

```html
<om-number-ticker
  [countTo]="5000"
  [countDuration]="3000"
  styleClass="ticker-custom-style"
></om-number-ticker>
```

This will create a ticker that counts up to 5000 over a duration of 3000ms.

## Styling

You can apply custom styles to the ticker using the styleClass input. For example:

```css
.ticker-custom-style {
  font-size: 48px;
  color: #4caf50;
  font-weight: bold;
  text-align: center;
}
```

This example styles the ticker with a larger font size, green color, bold font weight, and centered text.

## Contributing

Contributions are welcome. Please submit a pull request or open an issue to discuss your ideas.

## License

This project is licensed under the MIT License.