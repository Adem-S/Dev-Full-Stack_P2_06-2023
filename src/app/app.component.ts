import { Component, OnInit } from "@angular/core";
import { catchError, take } from "rxjs";
import { OlympicService } from "./core/services/olympic.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(private olympicService: OlympicService) {}

  error!: string;

  ngOnInit(): void {
    this.olympicService
      .loadInitialData()
      .pipe(take(1))
      .subscribe({
        error: (error) => {
          this.error = error;
        },
      });
  }
}
