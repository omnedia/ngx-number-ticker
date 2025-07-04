import {CommonModule} from "@angular/common";
import {ChangeDetectionStrategy, Component, Input, signal} from "@angular/core";

@Component({
  selector: "om-number-ticker",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./ngx-number-ticker.component.html",
  styleUrl: "./ngx-number-ticker.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxNumberTickerComponent {
  @Input("styleClass")
  styleClass?: string;

  @Input("countTo")
  set countTo(number: number) {
    this.targetNumber = number;
    this.countToNumber(number);
  }

  @Input("countDuration")
  set countDuration(countDuration: number) {
    this.countDurationValue = countDuration;

    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = undefined;
      this.countToNumber(this.targetNumber);
    }
  }

  countDurationValue = 2000;

  @Input("transformFunction")
  transformFunction?: (number: number) => string;

  targetNumber = 0;
  currentNumber = 0;
  displayNumber = signal("0");

  private frameId?: number;

  private countToNumber(number: number): void {
    if (number > this.currentNumber) {
      this.countUp(number);
      return;
    }

    this.countDown(number);
  }

  private countUp(target: number): void {
    const direction = "up";
    this.executeCount(target, direction);
  }

  private countDown(target: number): void {
    const direction = "down";
    this.executeCount(target, direction);
  }

  setCountValue(): void {
    if (!this.transformFunction) {
      this.displayNumber.set(`${this.currentNumber}`);
    } else {
      this.displayNumber.set(this.transformFunction(this.currentNumber));
    }
  }

  private executeCount(target: number, direction: "up" | "down"): void {
    const startNumber = this.currentNumber;
    const difference = Math.abs(target - startNumber);

    // Check if we have fewer than 10 digits to count
    const isSmallDifference = difference <= 10;
    const duration = this.countDurationValue;

    // If the difference is small, handle all of them in the easing phase
    if (isSmallDifference) {
      const slowCountingDuration = duration;
      const startTime = performance.now();

      const updateSmallDifference = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const percentComplete = Math.min(elapsed / slowCountingDuration, 1);
        const easedPercent = this.easeOutQuad(percentComplete);

        // Calculate the current number based on the eased percent
        this.currentNumber = this.calculateCurrentNumber(
          startNumber,
          target,
          easedPercent,
          direction,
        );

        if (elapsed < slowCountingDuration) {
          this.setCountValue();
          this.frameId = requestAnimationFrame(updateSmallDifference);
        } else {
          this.currentNumber = target; // Ensure final number is set
          this.setCountValue();
        }
      };

      this.frameId = requestAnimationFrame(updateSmallDifference);
    } else {
      // Normal case: Handle large differences with two phases
      const last10DigitsDuration = 1000; // 1 second for the last 10 digits
      const mainCountingDuration = duration - last10DigitsDuration;

      const last10Start = direction === "up" ? target - 10 : target + 10;
      const startTime = performance.now();

      const update = (currentTime: number) => {
        const elapsed = currentTime - startTime;

        if (
          (direction === "up" && this.currentNumber < last10Start) ||
          (direction === "down" && this.currentNumber > last10Start)
        ) {
          // Phase 1: Main counting phase
          const percentComplete = Math.min(elapsed / mainCountingDuration, 1);

          // Calculate current number based on the percentage of completion
          this.currentNumber = this.calculateCurrentNumber(
            startNumber,
            last10Start,
            percentComplete,
            direction,
          );

          if (elapsed < mainCountingDuration) {
            this.setCountValue();
            this.frameId = requestAnimationFrame(update);
          } else {
            this.currentNumber = last10Start;
            this.setCountValue();
            this.frameId = requestAnimationFrame(update);
          }
        } else {
          // Phase 2: Slow down for the last 10 digits
          const elapsedForLast10 = elapsed - mainCountingDuration;
          const percentComplete = Math.min(
            elapsedForLast10 / last10DigitsDuration,
            1,
          );
          const easedPercent = this.easeOutQuad(percentComplete);

          // Calculate the number for the last 10 digits
          this.currentNumber = this.calculateCurrentNumber(
            last10Start,
            target,
            easedPercent,
            direction,
          );

          if (elapsedForLast10 < last10DigitsDuration) {
            this.setCountValue();
            this.frameId = requestAnimationFrame(update);
          } else {
            this.currentNumber = target; // Ensure final number is set
            this.setCountValue();
          }
        }
      };

      this.frameId = requestAnimationFrame(update);
    }
  }

  // Helper function to calculate current number based on direction
  private calculateCurrentNumber(
    start: number,
    end: number,
    percent: number,
    direction: "up" | "down",
  ): number {
    if (direction === "up") {
      return Math.floor(start + (end - start) * percent);
    } else {
      return Math.floor(start - (start - end) * percent);
    }
  }

  // Easing function to slow down progressively
  private easeOutQuad(t: number): number {
    return t * (2 - t);
  }
}
